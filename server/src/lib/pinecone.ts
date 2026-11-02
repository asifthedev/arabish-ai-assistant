import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("PINECONE_API_KEY is missing in .env");
}

export const pinecone = new Pinecone({ apiKey });

// extra data we save with every vector
export type MetaData = {
  question: string;
  answer: string;
};

// the index is like a table in a normal database
export function getIndex() {
  const host = process.env.PINECONE_INDEX_HOST;
  if (!host) throw new Error("PINECONE_INDEX_HOST is missing in .env");

  return pinecone.index({ host });
}
