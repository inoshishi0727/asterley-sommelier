import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
  dbPath: path.resolve(__dirname, "../data/sommelier.db"),
} as const;

export function validateConfig(): void {
  if (!config.geminiApiKey) {
    console.error(
      "GEMINI_API_KEY is required. Get one at https://aistudio.google.com/apikey"
    );
    process.exit(1);
  }
}
