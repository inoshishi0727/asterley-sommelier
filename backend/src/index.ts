import express from "express";
import cors from "cors";
import path from "path";
import { config, validateConfig } from "./config";
import { chatRouter } from "./routes/chat";
import { adminRouter } from "./routes/admin";
import { menuRouter } from "./routes/menu";
import { subscribeRouter } from "./routes/subscribe";
import { trackRouter } from "./routes/track";
import { initDatabase } from "./services/session";
import { startRecipeScraper } from "./services/recipeScraper";
import { startShopifySync } from "./services/shopifyClient";

validateConfig();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve widget files statically
app.use("/widget", express.static(path.resolve(__dirname, "../../widget")));

// API routes
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);
app.use("/api/menu", menuRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/track", trackRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Catch-all: serve demo.html for any non-API, non-widget path so the proactive
// matcher sees the real pathname (e.g. /products/dispense-modern-british-amaro)
// on reload, mimicking how Shopify serves a page on every path.
app.get(/^(?!\/api\/|\/widget\/).*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../widget/demo.html"));
});

// Initialize database and start live data sync
initDatabase().catch((err) => {
  console.error("Firestore init failed:", err);
  process.exit(1);
});
startShopifySync();
startRecipeScraper();

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Asterley Sommelier API running on http://localhost:${config.port}`);
  console.log(`Widget demo: http://localhost:${config.port}/widget/demo.html`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
