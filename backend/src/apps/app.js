import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRouter from '../routes/health.routes.js';
import Router from '../routes/router.routes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse JSON once and let malformed payloads reach the structured error handler.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Requests without a parsed payload should behave like an empty object rather
// than causing destructuring errors inside controllers.
app.use((req, _res, next) => {
  if (req.body === null || req.body === undefined) req.body = {};
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/docsapi.html'));
});

app.get('/health', healthRouter);

app.use('/api/v1', Router);

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }

  if (error?.name === "MulterError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
