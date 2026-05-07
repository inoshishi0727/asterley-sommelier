import { subscribeEmail } from "../services/emailService";

export interface EmailCaptureArgs {
  email?: string;
}

export async function executeEmailCapture(args: EmailCaptureArgs): Promise<string> {
  const result = await subscribeEmail(args.email || "");
  if (result.success) {
    return JSON.stringify({ subscribed: true, email: args.email });
  }
  return JSON.stringify({ subscribed: false, error: result.error });
}

export const emailCaptureDeclaration = {
  name: "email_capture",
  description:
    "Subscribe a customer's email address to the Asterley Bros newsletter. Call this as soon as the customer provides an email address in the context of signing up or staying in touch — do not ask them to confirm first.",
  input_schema: {
    type: "object" as const,
    properties: {
      email: {
        type: "string",
        description: "The customer's email address",
      },
    },
    required: ["email"],
  },
};
