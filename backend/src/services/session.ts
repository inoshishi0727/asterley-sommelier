import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { config } from "../config";
import type { Session, Message, ConversationSummary, AnalyticsData } from "../types";

let db: Database.Database;

export function initDatabase(): void {
  // Ensure the data directory exists
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(config.dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_active TEXT NOT NULL DEFAULT (datetime('now')),
      page_url TEXT,
      messages_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_last_active ON sessions(last_active);
  `);
}

export function getDb(): Database.Database {
  return db;
}

// ── Session CRUD ──

export function createSession(pageUrl?: string): Session {
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    "INSERT INTO sessions (id, created_at, last_active, page_url, messages_count) VALUES (?, ?, ?, ?, 0)"
  ).run(id, now, now, pageUrl || null);

  return { id, createdAt: now, lastActive: now, pageUrl: pageUrl || null, messagesCount: 0 };
}

export function getSession(sessionId: string): Session | undefined {
  const row = db
    .prepare("SELECT id, created_at as createdAt, last_active as lastActive, page_url as pageUrl, messages_count as messagesCount FROM sessions WHERE id = ?")
    .get(sessionId) as Session | undefined;

  if (!row) return undefined;

  // Check if session has expired
  const lastActive = new Date(row.lastActive).getTime();
  if (Date.now() - lastActive > config.sessionTimeoutMs) {
    return undefined; // Expired
  }

  return row;
}

export function touchSession(sessionId: string): void {
  db.prepare("UPDATE sessions SET last_active = datetime('now') WHERE id = ?").run(sessionId);
}

// ── Message Operations ──

export function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  metadata?: string
): Message {
  const id = uuidv4();
  const now = new Date().toISOString();

  const insert = db.transaction(() => {
    db.prepare(
      "INSERT INTO messages (id, session_id, role, content, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, sessionId, role, content, metadata || null, now);

    db.prepare(
      "UPDATE sessions SET messages_count = messages_count + 1, last_active = datetime('now') WHERE id = ?"
    ).run(sessionId);
  });

  insert();

  return { id, sessionId, role, content, metadata, createdAt: now };
}

export function getSessionMessages(sessionId: string): Message[] {
  return db
    .prepare(
      "SELECT id, session_id as sessionId, role, content, metadata, created_at as createdAt FROM messages WHERE session_id = ? ORDER BY created_at ASC"
    )
    .all(sessionId) as Message[];
}

// ── Admin Queries ──

export function listConversations(limit = 50, offset = 0): ConversationSummary[] {
  const rows = db
    .prepare(
      `SELECT
        s.id as sessionId,
        s.created_at as createdAt,
        s.last_active as lastActive,
        s.messages_count as messagesCount,
        (SELECT content FROM messages WHERE session_id = s.id AND role = 'user' ORDER BY created_at ASC LIMIT 1) as firstMessage
      FROM sessions s
      ORDER BY s.last_active DESC
      LIMIT ? OFFSET ?`
    )
    .all(limit, offset) as ConversationSummary[];

  return rows;
}

export function getConversation(sessionId: string): { session: Session; messages: Message[] } | undefined {
  const session = db
    .prepare(
      "SELECT id, created_at as createdAt, last_active as lastActive, page_url as pageUrl, messages_count as messagesCount FROM sessions WHERE id = ?"
    )
    .get(sessionId) as Session | undefined;

  if (!session) return undefined;

  const messages = getSessionMessages(sessionId);
  return { session, messages };
}

export function getAnalytics(): AnalyticsData {
  const totals = db
    .prepare(
      `SELECT
        COUNT(DISTINCT s.id) as totalConversations,
        COALESCE(SUM(s.messages_count), 0) as totalMessages
      FROM sessions s`
    )
    .get() as { totalConversations: number; totalMessages: number };

  const today = db
    .prepare(
      "SELECT COUNT(*) as count FROM sessions WHERE date(created_at) = date('now')"
    )
    .get() as { count: number };

  const avgMessages =
    totals.totalConversations > 0
      ? Math.round((totals.totalMessages / totals.totalConversations) * 10) / 10
      : 0;

  // Top user questions (first message of each session)
  const topQuestions = db
    .prepare(
      `SELECT content as question, COUNT(*) as count
       FROM messages
       WHERE role = 'user'
       AND id IN (
         SELECT id FROM messages WHERE role = 'user'
         GROUP BY session_id
         HAVING created_at = MIN(created_at)
       )
       GROUP BY content
       ORDER BY count DESC
       LIMIT 10`
    )
    .all() as { question: string; count: number }[];

  return {
    totalConversations: totals.totalConversations,
    totalMessages: totals.totalMessages,
    avgMessagesPerConversation: avgMessages,
    conversationsToday: today.count,
    topQuestions,
  };
}

// ── Cleanup ──

export function cleanExpiredSessions(): number {
  const cutoff = new Date(Date.now() - config.sessionTimeoutMs).toISOString();

  const result = db
    .prepare("DELETE FROM sessions WHERE last_active < ?")
    .run(cutoff);

  return result.changes;
}
