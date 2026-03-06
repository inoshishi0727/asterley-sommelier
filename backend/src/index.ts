import express from "express";
import cors from "cors";
import path from "path";
import { config, validateConfig } from "./config";
import { chatRouter } from "./routes/chat";
import { adminRouter } from "./routes/admin";
import { initDatabase } from "./services/session";

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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase();

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Asterley Sommelier API running on http://localhost:${config.port}`);
  console.log(`Widget demo: http://localhost:${config.port}/widget/demo.html`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
