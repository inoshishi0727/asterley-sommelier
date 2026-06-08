import { Router, Request, Response } from "express";
import { db, admin } from "../lib/firebase";

export const trackRouter = Router();

const ALLOWED_EVENTS = new Set(["suggestion_shown", "suggestion_yes", "suggestion_no"]);

trackRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { event, suggestionId, pageUrl, sessionId } = req.body ?? {};
    if (!ALLOWED_EVENTS.has(event) || typeof suggestionId !== "string") {
      res.status(400).json({ ok: false, error: "Invalid event payload" });
      return;
    }
    await db.collection("proactive_events").add({
      event,
      suggestionId,
      pageUrl: typeof pageUrl === "string" ? pageUrl : null,
      sessionId: typeof sessionId === "string" ? sessionId : null,
      ts: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[track] write failed", err);
    res.status(500).json({ ok: false });
  }
});
