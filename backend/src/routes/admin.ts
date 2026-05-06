import { Router, Request, Response } from "express";
import {
  listConversations,
  getConversation,
  getAnalytics,
} from "../services/session";

export const adminRouter = Router();

// List recent conversations
adminRouter.get("/conversations", async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(String(req.query.limit || "50"), 10), 200);
  const offset = parseInt(String(req.query.offset || "0"), 10);

  const conversations = await listConversations(limit, offset);
  res.json({ conversations, limit, offset });
});

// View a specific conversation
adminRouter.get("/conversations/:id", async (req: Request, res: Response) => {
  const conversation = await getConversation(String(req.params.id));

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Parse assistant messages back to structured format for display
  const formattedMessages = conversation.messages.map((m) => {
    if (m.role === "assistant") {
      try {
        const parsed = JSON.parse(m.content);
        return { ...m, content: parsed.message, structured: parsed };
      } catch {
        return m;
      }
    }
    return m;
  });

  res.json({
    session: conversation.session,
    messages: formattedMessages,
  });
});

// Analytics dashboard data
adminRouter.get("/analytics", async (_req: Request, res: Response) => {
  const analytics = await getAnalytics();
  res.json(analytics);
});
