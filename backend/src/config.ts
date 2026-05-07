import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  sessionTimeoutMs: 30 * 60 * 1000,
  shopifyStorefrontToken: process.env.SHOPIFY_STOREFRONT_TOKEN || "",
  shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN || "",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || "",
  adminApiKey: process.env.ADMIN_API_KEY || "",
  emailPlatform: (process.env.EMAIL_PLATFORM || "firestore") as "klaviyo" | "mailchimp" | "firestore",
  klaviyoApiKey: process.env.KLAVIYO_API_KEY || "",
  klaviyoListId: process.env.KLAVIYO_LIST_ID || "",
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY || "",
  mailchimpListId: process.env.MAILCHIMP_LIST_ID || "",
  mailchimpServer: process.env.MAILCHIMP_SERVER || "",
} as const;

export function validateConfig(): void {
  if (!config.geminiApiKey) {
    console.error(
      "GEMINI_API_KEY is required. Get one at https://aistudio.google.com/apikey"
    );
    process.exit(1);
  }
  if (!config.firebaseProjectId || !config.firebaseClientEmail || !config.firebasePrivateKey) {
    console.error(
      "Firebase credentials missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in environment."
    );
    process.exit(1);
  }
}
