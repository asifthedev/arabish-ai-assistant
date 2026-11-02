import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is undefine");
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export const CHAT_MODEL = "gpt-6-luna";
export const EMBEDDING_MODEL = "text-embedding-3-small";
