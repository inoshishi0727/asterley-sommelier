import { Router, Request, Response } from "express";
import { subscribeEmail } from "../services/emailService";

export const subscribeRouter = Router();

subscribeRouter.post("/", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ success: false, error: "Email is required." });
    return;
  }
  const result = await subscribeEmail(email);
  if (result.success) {
    res.json({ success: true });
  } else {
    res.status(422).json({ success: false, error: result.error });
  }
});
