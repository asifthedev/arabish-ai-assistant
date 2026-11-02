import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

// stop early if the key is missing, so the error is easy to find
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing in .env");
}

export const openai = new OpenAI({ apiKey });

// model that writes the answers
export const CHAT_MODEL = "gpt-6-luna";

// model that turns text into vectors (numbers) for search
export const EMBEDDING_MODEL = "text-embedding-3-small";
