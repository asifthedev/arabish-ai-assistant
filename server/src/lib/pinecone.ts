import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("PINECONE_API_KEY environment variable is undefine");
}

export const pinecone = new Pinecone({
  apiKey: apiKey,
});

export type MetaData = {
  question: string;
  answer: string;
};

// Creating an index or you can relate to model/table in ORM/ODM used to interact with database
export const getIndex = () => {
  const host = process.env.PINECONE_INDEX_HOST;
  if (!host) throw new Error("PINECONE_INDEX_HOST is missing in .env");
  return pinecone.index({ host });
};
