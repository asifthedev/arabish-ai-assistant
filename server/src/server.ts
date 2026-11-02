import { Router } from "express";
import { handleChat } from "./services/chat.js";

const chatRouter = Router();

chatRouter.get("/", (req, res) => {
  const { message, previousResponseId} = ;
});
