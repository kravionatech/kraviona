import webPush from "web-push";

const keys = webPush.generateVAPIDKeys();

process.stdout.write(
  [
    "Add these values to the backend deployment environment:",
    "WEB_PUSH_VAPID_SUBJECT=mailto:kravionatech@gmail.com",
    `WEB_PUSH_VAPID_PUBLIC_KEY=${keys.publicKey}`,
    `WEB_PUSH_VAPID_PRIVATE_KEY=${keys.privateKey}`,
    "",
    "Keep WEB_PUSH_VAPID_PRIVATE_KEY secret and never commit it.",
  ].join("\n"),
);
