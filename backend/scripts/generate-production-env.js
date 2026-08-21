import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import webPush from "web-push";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const backendDirectory = resolve(scriptDirectory, "..");
const sourcePath = resolve(backendDirectory, ".env");
const targetPath = resolve(backendDirectory, ".env.production");

if (existsSync(targetPath)) {
  throw new Error(
    "backend/.env.production already exists; refusing to rotate production secrets.",
  );
}

const localEnvironment = existsSync(sourcePath)
  ? dotenv.parse(readFileSync(sourcePath))
  : {};
const environment = { ...localEnvironment, ...process.env };

const requiredSecret = (name) => {
  const value = String(environment[name] || "").trim();
  const isPlaceholder = /^(?:replace-me|changeme|your[-_]|<)/i.test(value);

  if (!value || isPlaceholder) {
    throw new Error(`${name} must be set to a real value in backend/.env.`);
  }

  return value;
};

const vapidKeys = webPush.generateVAPIDKeys();
const envValue = (value) => JSON.stringify(String(value));
const productionEnvironment = [
  "# Generated locally for the Kraviona production API.",
  "# This file is Git-ignored. Store the same values in the deployment secret store.",
  "NODE_ENV=production",
  `APP_NAME=${envValue("Kraviona API")}`,
  "APP_VERSION=1.0.0",
  "PORT=5000",
  "",
  `MONGO_URI=${envValue(requiredSecret("MONGO_URI"))}`,
  `DB_NAME=${envValue(environment.DB_NAME || "kraviona")}`,
  "",
  `JWT_SECRET=${envValue(randomBytes(64).toString("base64url"))}`,
  `JWT_REFRESH_SECRET=${envValue(randomBytes(64).toString("base64url"))}`,
  "JWT_EXPIRES_IN=15m",
  "JWT_REFRESH_EXPIRES_IN=7d",
  "",
  `CORS_ORIGINS=${envValue(
    "https://kraviona.com,https://admin.kraviona.com",
  )}`,
  "",
  `CLOUDINARY_CLOUD_NAME=${envValue(requiredSecret("CLOUDINARY_CLOUD_NAME"))}`,
  `CLOUDINARY_API_KEY=${envValue(requiredSecret("CLOUDINARY_API_KEY"))}`,
  `CLOUDINARY_API_SECRET=${envValue(requiredSecret("CLOUDINARY_API_SECRET"))}`,
  "",
  `WEB_PUSH_VAPID_SUBJECT=${envValue("mailto:kravionatech@gmail.com")}`,
  `WEB_PUSH_VAPID_PUBLIC_KEY=${envValue(vapidKeys.publicKey)}`,
  `WEB_PUSH_VAPID_PRIVATE_KEY=${envValue(vapidKeys.privateKey)}`,
  "",
].join("\n");

writeFileSync(targetPath, productionEnvironment, {
  encoding: "utf8",
  flag: "wx",
  mode: 0o600,
});

console.log("Created backend/.env.production with fresh production secrets.");
