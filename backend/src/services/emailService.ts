import { config } from "../config";
import { db } from "../lib/firebase";

export interface SubscribeResult {
  success: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

async function subscribeKlaviyo(email: string): Promise<SubscribeResult> {
  const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${config.klaviyoApiKey}`;
  const body = {
    data: {
      type: "subscription",
      attributes: {
        list_id: config.klaviyoListId,
        email_address: email,
        subscriptions: {
          email: { marketing: { consent: "SUBSCRIBED" } },
        },
      },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", revision: "2024-02-15" },
    body: JSON.stringify(body),
  });

  if (res.status === 202 || res.status === 200 || res.status === 201) {
    return { success: true };
  }
  const text = await res.text().catch(() => res.status.toString());
  console.error("[emailService] Klaviyo error:", res.status, text);
  return { success: false, error: "Platform error — email not saved." };
}

async function subscribeMailchimp(email: string): Promise<SubscribeResult> {
  const hash = Buffer.from(email.toLowerCase()).toString("hex");
  const url = `https://${config.mailchimpServer}.api.mailchimp.com/3.0/lists/${config.mailchimpListId}/members/${hash}`;
  const creds = Buffer.from(`anystring:${config.mailchimpApiKey}`).toString("base64");

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${creds}`,
    },
    body: JSON.stringify({ email_address: email, status_if_new: "subscribed" }),
  });

  if (res.ok) return { success: true };
  const text = await res.text().catch(() => res.status.toString());
  console.error("[emailService] Mailchimp error:", res.status, text);
  return { success: false, error: "Platform error — email not saved." };
}

async function subscribeFirestore(email: string): Promise<SubscribeResult> {
  const docId = email.toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  await db.collection("newsletter_subscribers").doc(docId).set(
    {
      email: email.toLowerCase(),
      source: "chat",
      consent: true,
      subscribedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return { success: true };
}

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  const trimmed = email.trim();

  if (!isValidEmail(trimmed)) {
    return { success: false, error: "Invalid email address." };
  }

  try {
    switch (config.emailPlatform) {
      case "klaviyo":
        return await subscribeKlaviyo(trimmed);
      case "mailchimp":
        return await subscribeMailchimp(trimmed);
      default:
        return await subscribeFirestore(trimmed);
    }
  } catch (err) {
    console.error("[emailService] Unexpected error:", err);
    return { success: false, error: "Something went wrong — please try again." };
  }
}
