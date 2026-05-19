import { db } from "../lib/firebase";

export async function executeRecordCancellationReason(args: Record<string, any>): Promise<string> {
  try {
    await db.collection("cancellation_reasons").add({
      reason: args.reason,
      sessionId: args.sessionId ?? "",
      recordedAt: new Date().toISOString(),
    });
    return JSON.stringify({ success: true });
  } catch (e) {
    return JSON.stringify({ success: false, error: (e as Error).message });
  }
}

export const recordCancellationReasonDeclaration = {
  name: "record_cancellation_reason",
  description: "Record the reason a Negroni Society member is cancelling their subscription. Call this as soon as the customer gives a reason.",
  input_schema: {
    type: "object" as const,
    properties: {
      reason: { type: "string", description: "The cancellation reason provided by the customer" },
    },
    required: ["reason"],
  },
};
