import { Router, Request, Response } from "express";
import { chat } from "../services/gemini";
import {
  createSession,
  getSession,
  addMessage,
  getSessionMessages,
} from "../services/session";
import type { ChatRequest } from "../types";

export const chatRouter = Router();

chatRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { sessionId, message, pageContext } = req.body as ChatRequest;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Get or create session
    let session;
    if (sessionId) {
      session = getSession(sessionId);
    }
    if (!session) {
      session = createSession(pageContext?.currentUrl);
    }

    // Save user message
    addMessage(session.id, "user", message.trim());

    // Get conversation history (excluding the message we just added, since we pass it directly)
    const history = getSessionMessages(session.id).slice(0, -1);

    // Call Gemini
    const response = await chat(message.trim(), history, pageContext);
    response.sessionId = session.id;

    // Save assistant response
    addMessage(
      session.id,
      "assistant",
      JSON.stringify({
        message: response.message,
        productCards: response.productCards,
        recipeCards: response.recipeCards,
        suggestedActions: response.suggestedActions,
      })
    );

    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);

    // Graceful fallback
    res.status(500).json({
      sessionId: req.body?.sessionId || "",
      message:
        "I'm having a moment — apologies! Please try again, or drop us a line at hello@asterleybros.com and we'll help you directly.",
      productCards: [],
      recipeCards: [],
      suggestedActions: [
        {
          label: "Try again",
          type: "question",
          value: req.body?.message || "Hello",
        },
        {
          label: "Browse products",
          type: "link",
          value: "https://asterleybros.com/collections/all",
        },
        {
          label: "Email us",
          type: "link",
          value: "mailto:hello@asterleybros.com",
        },
      ],
    });
  }
});
