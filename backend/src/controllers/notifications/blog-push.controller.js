import {
  BlogPushSubscription,
  hashPushEndpoint,
} from "../../models/notifications/blog-push-subscription.model.js";
import { getBlogPushPublicKey } from "../../services/blog-push.service.js";

const ALLOWED_PUSH_HOSTS = new Set([
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
]);

const isAllowedPushEndpoint = (endpoint) => {
  try {
    const url = new URL(endpoint);
    return (
      url.protocol === "https:" &&
      (ALLOWED_PUSH_HOSTS.has(url.hostname) ||
        url.hostname.endsWith(".push.apple.com"))
    );
  } catch {
    return false;
  }
};

const getSubscriptionPayload = (body = {}) => body.subscription || body;

export const getPublicKey = async (_req, res) => {
  const publicKey = getBlogPushPublicKey();
  if (!publicKey) {
    return res.status(503).json({
      success: false,
      message: "Blog notifications are not configured yet.",
    });
  }

  return res.status(200).json({ success: true, data: { publicKey } });
};

export const subscribeToBlogPush = async (req, res) => {
  try {
    const subscription = getSubscriptionPayload(req.body);
    const endpoint = String(subscription?.endpoint || "").trim();
    const p256dh = String(subscription?.keys?.p256dh || "").trim();
    const auth = String(subscription?.keys?.auth || "").trim();

    if (
      !isAllowedPushEndpoint(endpoint) ||
      !p256dh ||
      !auth ||
      p256dh.length > 512 ||
      auth.length > 256
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid browser push subscription is required.",
      });
    }

    const expirationValue =
      subscription.expirationTime == null
        ? Number.NaN
        : Number(subscription.expirationTime);
    const expirationTime = Number.isFinite(expirationValue)
      ? new Date(expirationValue)
      : null;
    const endpointHash = hashPushEndpoint(endpoint);

    await BlogPushSubscription.findOneAndUpdate(
      { endpointHash },
      {
        $set: {
          endpoint,
          keys: { p256dh, auth },
          topic: "blog",
          isActive: true,
          expirationTime,
          userAgent: String(req.get("user-agent") || "").slice(0, 500),
          language: String(req.body?.language || "en-IN").slice(0, 20),
          failureCount: 0,
        },
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    return res.status(201).json({
      success: true,
      message: "Blog notifications enabled.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unsubscribeFromBlogPush = async (req, res) => {
  try {
    const endpoint = String(
      req.body?.endpoint || req.body?.subscription?.endpoint || "",
    ).trim();

    if (!isAllowedPushEndpoint(endpoint)) {
      return res.status(400).json({
        success: false,
        message: "A valid push endpoint is required.",
      });
    }

    await BlogPushSubscription.deleteOne({
      endpointHash: hashPushEndpoint(endpoint),
    });

    return res.status(200).json({
      success: true,
      message: "Blog notifications disabled.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
