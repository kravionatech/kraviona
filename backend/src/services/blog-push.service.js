import webPush from "web-push";

import config from "../config/config.js";
import { PostModel } from "../models/blog/post.model.js";
import { BlogPushSubscription } from "../models/notifications/blog-push-subscription.model.js";

const hasVapidConfiguration = Boolean(
  config.WEB_PUSH_VAPID_PUBLIC_KEY && config.WEB_PUSH_VAPID_PRIVATE_KEY,
);

if (hasVapidConfiguration) {
  webPush.setVapidDetails(
    config.WEB_PUSH_VAPID_SUBJECT,
    config.WEB_PUSH_VAPID_PUBLIC_KEY,
    config.WEB_PUSH_VAPID_PRIVATE_KEY,
  );
}

const plainText = (value = "") =>
  String(value)
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

const absoluteImageUrl = (value) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://kraviona.com/${String(value).replace(/^\/+/, "")}`;
};

const buildPayload = (post) => ({
  title: `New on Kraviona: ${plainText(post.title).slice(0, 80)}`,
  body:
    plainText(post.excerpt || post.content).slice(0, 180) ||
    "A new Kraviona article is ready to read.",
  icon: "/icon-192.png",
  badge: "/favicon-32x32.png",
  image: absoluteImageUrl(post.featuredImage?.url),
  tag: `kraviona-blog-${post._id}`,
  renotify: false,
  data: {
    topic: "blog",
    url: `https://kraviona.com/blog/${post.slug}`,
  },
});

const markFailure = async (subscription, permanent) => {
  if (permanent) {
    await BlogPushSubscription.deleteOne({ _id: subscription._id });
    return;
  }

  const failureCount = Number(subscription.failureCount || 0) + 1;
  await BlogPushSubscription.updateOne(
    { _id: subscription._id },
    {
      $set: { isActive: failureCount < 4 },
      $inc: { failureCount: 1 },
    },
  );
};

export const getBlogPushPublicKey = () =>
  hasVapidConfiguration ? config.WEB_PUSH_VAPID_PUBLIC_KEY : null;

export async function notifyBlogSubscribers(post) {
  if (!hasVapidConfiguration || !post?.slug) {
    return { sent: 0, failed: 0, skipped: true };
  }

  // Atomically claim the article. Parallel admin/API/MCP requests therefore
  // cannot send the same publication alert more than once.
  const claimedPost = await PostModel.findOneAndUpdate(
    {
      _id: post._id,
      status: "published",
      pushNotificationSentAt: null,
    },
    { $set: { pushNotificationSentAt: new Date() } },
    { new: true },
  );

  if (!claimedPost) {
    return { sent: 0, failed: 0, skipped: true, reason: "already-notified" };
  }

  const subscriptions = await BlogPushSubscription.find({
    topic: "blog",
    isActive: true,
    $or: [{ expirationTime: null }, { expirationTime: { $gt: new Date() } }],
  })
    .select("+endpoint +keys.p256dh +keys.auth failureCount")
    .limit(5000);

  const payload = JSON.stringify(buildPayload(claimedPost));
  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },
          payload,
          { TTL: 86400, urgency: "normal", timeout: 8000 },
        );
        sent += 1;
        await BlogPushSubscription.updateOne(
          { _id: subscription._id },
          {
            $set: {
              failureCount: 0,
              isActive: true,
              lastNotifiedAt: new Date(),
            },
          },
        );
      } catch (error) {
        failed += 1;
        const permanent = [404, 410].includes(error?.statusCode);
        await markFailure(subscription, permanent);
      }
    }),
  );

  return { sent, failed, skipped: false };
}
