import { createHttpApp } from "../http.js";

// Vercel caches this module between warm invocations. The app and MongoDB
// connection can therefore be reused without storing user authorization state
// in function memory.
const app = createHttpApp();

export default app;
