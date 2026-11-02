import { Router } from "express";
import { handleChat } from "../services/chat.js";

const chatRouter = Router();

const MAX_MESSAGE_LENGTH = 500;

// POST /api/chat  body: { message, previousResponseId? }
chatRouter.post("/", async (req, res) => {
  const { message, previousResponseId } = req.body;

  // check the input before calling OpenAI
  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: "Message is too long (max 500 characters)" });
    return;
  }

  // previousResponseId is optional, but if sent it must be a string
  if (
    previousResponseId !== undefined &&
    typeof previousResponseId !== "string"
  ) {
    res.status(400).json({ error: "Invalid previousResponseId" });
    return;
  }

  const result = await handleChat(message.trim(), previousResponseId);
  res.json(result);
});

export { chatRouter };
