import { db, admin } from "../lib/firebase";

const USAGE = "sommelier_usage";

interface ClaudeUsage {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

export function logClaudeUsage(
  sessionId: string,
  model: string,
  usage: ClaudeUsage | undefined,
  context: { round: number; toolUse?: boolean }
): void {
  if (!usage) return;
  db.collection(USAGE)
    .add({
      sessionId,
      model,
      inputTokens: usage.input_tokens ?? 0,
      outputTokens: usage.output_tokens ?? 0,
      cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
      cacheReadTokens: usage.cache_read_input_tokens ?? 0,
      round: context.round,
      toolUse: context.toolUse ?? false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[usage] failed to log:", msg);
    });
}
