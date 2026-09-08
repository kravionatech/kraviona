import { ChatLog } from "../models/chatbot/chatLog.model.js";

// In-memory sliding window rate limiter for public chatbot
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 messages per minute per IP

// Periodic cleanup of stale rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.resetAt > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

// Sensitive keywords / prompt injection markers
const SENSITIVE_PATTERNS = [
  /\b(admin|superadmin|super[ _-]?admin)\b/i,
  /\b(password|passwd|secret|credential|auth[ _-]?token|jwt|api[ _-]?key|private[ _-]?key)\b/i,
  /\b(env|dotenv|\.env|config\.js|connection[ _-]?string|database[ _-]?url|mongo[ _-]?uri)\b/i,
  /\b(draft|unpublished|archived|scheduled[ _-]?post|deleted)\b/i,
  /\b(mcp|shell|bash|exec|cmd|eval|sql|nosql|injection)\b/i,
  /\b(ignore (all )?previous instructions|system prompt|reveal (your )?instructions|developer mode|jailbreak)\b/i,
  /\b(subscriber[s]?|lead[s]?|contact[ _-]?messages|user[ _-]?list|login[ _-]?history)\b/i,
];

export const chatbotSecurityMiddleware = (req, res, next) => {
  // 1. IP extraction
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown-client";

  const now = Date.now();
  let clientLimit = rateLimitMap.get(ip);

  if (!clientLimit || now > clientLimit.resetAt) {
    clientLimit = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, clientLimit);
  } else {
    clientLimit.count += 1;
    if (clientLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        success: false,
        message: "You are sending messages too quickly. Please wait a moment before trying again.",
      });
    }
  }

  // 2. Request body validation
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid message.",
    });
  }

  if (message.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Message is too long. Please keep questions under 500 characters.",
    });
  }

  // 3. Sensitive / Admin check: return exact prompt requirement if detected
  const isSensitive = SENSITIVE_PATTERNS.some((pattern) => pattern.test(message));
  if (isSensitive) {
    ChatLog.create({
      ip,
      query: message,
      reply: "Sorry, I can only provide information available publicly on this website.",
      responseType: "restricted",
      sources: [],
      userAgent: req.headers["user-agent"] || "",
    }).catch(() => null);

    return res.status(200).json({
      success: true,
      data: {
        reply: "Sorry, I can only provide information available publicly on this website.",
        sources: [],
        type: "restricted",
      },
    });
  }

  req.sanitizedMessage = message;
  next();
};
