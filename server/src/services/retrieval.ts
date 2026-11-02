import { openai, EMBEDDING_MODEL } from "../lib/openai.js";
import { getIndex } from "../lib/pinecone.js";

// how many results to get from Pinecone
const TOP_K = 5;

// ignore results that are not similar enough (score is 0 to 1)
const MIN_SCORE = 0.4;

export type FaqMatch = {
  question: string;
  answer: string;
  score: number;
};

export async function searchFAQ(query: string): Promise<FaqMatch[]> {
  // 1. turn the query into a vector
  const { data } = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });

  const queryVector = data[0]?.embedding;
  if (!queryVector) throw new Error("Embedding failed");

  // 2. find the closest FAQs in Pinecone
  const { matches } = await getIndex().query({
    topK: TOP_K,
    vector: queryVector,
    includeMetadata: true,
  });

  // 3. keep only good matches that have a question and answer
  const results: FaqMatch[] = [];

  for (const match of matches) {
    const question = match.metadata?.question;
    const answer = match.metadata?.answer;
    const score = match.score;

    if (
      typeof question === "string" &&
      typeof answer === "string" &&
      typeof score === "number" &&
      score >= MIN_SCORE
    ) {
      results.push({ question, answer, score });
    }
  }

  return results;
}
