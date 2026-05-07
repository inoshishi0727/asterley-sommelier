import { v4 as uuidv4 } from "uuid";
import { db, admin } from "../lib/firebase";
import { config } from "../config";
import type {
  Session,
  Message,
  ConversationSummary,
  AnalyticsData,
} from "../types";

const CONVERSATIONS = "sommelier_conversations";

function tsToIso(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (value instanceof admin.firestore.Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

function convDoc(sessionId: string) {
  return db.collection(CONVERSATIONS).doc(sessionId);
}

function messagesCol(sessionId: string) {
  return convDoc(sessionId).collection("messages");
}

// ── Init ──

export async function initDatabase(): Promise<void> {
  // Verify Firestore connection by listing one doc.
  await db.collection(CONVERSATIONS).limit(1).get();
  console.log(`[session] Firestore connected: project=${config.firebaseProjectId}`);
}

// ── Session CRUD ──

export async function createSession(pageUrl?: string): Promise<Session> {
  const id = uuidv4();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const nowIso = new Date().toISOString();

  await convDoc(id).set({
    createdAt: now,
    lastActive: now,
    pageUrl: pageUrl || null,
    messagesCount: 0,
    source: "sommelier",
    firstUserMessage: null,
  });

  return { id, createdAt: nowIso, lastActive: nowIso, pageUrl: pageUrl || null, messagesCount: 0 };
}

export async function getSession(sessionId: string): Promise<Session | undefined> {
  const snap = await convDoc(sessionId).get();
  if (!snap.exists) return undefined;
  const data = snap.data()!;

  const lastActiveIso = tsToIso(data.lastActive);
  if (Date.now() - new Date(lastActiveIso).getTime() > config.sessionTimeoutMs) {
    return undefined;
  }

  return {
    id: sessionId,
    createdAt: tsToIso(data.createdAt),
    lastActive: lastActiveIso,
    pageUrl: data.pageUrl ?? null,
    messagesCount: data.messagesCount ?? 0,
  };
}

export async function touchSession(sessionId: string): Promise<void> {
  await convDoc(sessionId).update({
    lastActive: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ── Messages ──

export async function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  metadata?: string
): Promise<Message> {
  const id = uuidv4();
  const now = new Date();
  const nowIso = now.toISOString();
  // Use a client-side Timestamp for createdAt so orderBy("createdAt") is immediately
  // consistent after batch.commit() — serverTimestamp() resolves asynchronously and
  // can cause the just-written message to sort to position 0, breaking history slicing.
  const msgTs = admin.firestore.Timestamp.fromDate(now);
  const sessionTs = admin.firestore.FieldValue.serverTimestamp();

  const batch = db.batch();
  batch.set(messagesCol(sessionId).doc(id), {
    role,
    content,
    metadata: metadata || null,
    createdAt: msgTs,
  });

  const updates: Record<string, unknown> = {
    lastActive: sessionTs,
    messagesCount: admin.firestore.FieldValue.increment(1),
  };
  if (role === "user") {
    // Best-effort denormalization: only set firstUserMessage if not already set.
    const snap = await convDoc(sessionId).get();
    if (snap.exists && !snap.data()?.firstUserMessage) {
      updates.firstUserMessage = content;
    }
  }
  batch.update(convDoc(sessionId), updates);

  await batch.commit();

  return { id, sessionId, role, content, metadata, createdAt: nowIso };
}

export async function getSessionMessages(sessionId: string): Promise<Message[]> {
  const snap = await messagesCol(sessionId).orderBy("createdAt", "asc").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      sessionId,
      role: data.role,
      content: data.content,
      metadata: data.metadata ?? undefined,
      createdAt: tsToIso(data.createdAt),
    };
  });
}

// ── Admin Queries ──

export async function listConversations(limit = 50, offset = 0): Promise<ConversationSummary[]> {
  const snap = await db
    .collection(CONVERSATIONS)
    .orderBy("lastActive", "desc")
    .offset(offset)
    .limit(limit)
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      sessionId: d.id,
      createdAt: tsToIso(data.createdAt),
      lastActive: tsToIso(data.lastActive),
      messagesCount: data.messagesCount ?? 0,
      firstMessage: data.firstUserMessage ?? null,
    };
  });
}

export async function getConversation(
  sessionId: string
): Promise<{ session: Session; messages: Message[] } | undefined> {
  const docSnap = await convDoc(sessionId).get();
  if (!docSnap.exists) return undefined;
  const data = docSnap.data()!;

  const session: Session = {
    id: sessionId,
    createdAt: tsToIso(data.createdAt),
    lastActive: tsToIso(data.lastActive),
    pageUrl: data.pageUrl ?? null,
    messagesCount: data.messagesCount ?? 0,
  };

  const messages = await getSessionMessages(sessionId);
  return { session, messages };
}

export async function getAnalytics(): Promise<AnalyticsData> {
  // Note: Firestore has no count aggregation across subcollections cheaply.
  // For a low-volume bot, fetching all conversation docs is fine; revisit at scale.
  const snap = await db.collection(CONVERSATIONS).get();

  let totalConversations = 0;
  let totalMessages = 0;
  let conversationsToday = 0;
  const firstMessageCounts: Record<string, number> = {};
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  for (const doc of snap.docs) {
    const data = doc.data();
    totalConversations += 1;
    totalMessages += data.messagesCount ?? 0;

    const created = new Date(tsToIso(data.createdAt));
    if (created >= startOfToday) conversationsToday += 1;

    const first: string | undefined = data.firstUserMessage;
    if (first) {
      firstMessageCounts[first] = (firstMessageCounts[first] || 0) + 1;
    }
  }

  const avgMessages =
    totalConversations > 0
      ? Math.round((totalMessages / totalConversations) * 10) / 10
      : 0;

  const topQuestions = Object.entries(firstMessageCounts)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalConversations,
    totalMessages,
    avgMessagesPerConversation: avgMessages,
    conversationsToday,
    topQuestions,
  };
}

// ── Cleanup ──

export async function cleanExpiredSessions(): Promise<number> {
  const cutoff = new Date(Date.now() - config.sessionTimeoutMs);
  const snap = await db
    .collection(CONVERSATIONS)
    .where("lastActive", "<", admin.firestore.Timestamp.fromDate(cutoff))
    .get();

  let deleted = 0;
  for (const doc of snap.docs) {
    // Keep history — don't actually delete. Just log.
    deleted += 1;
  }
  return deleted;
}
