import { openai, EMBEDDING_MODEL } from "../lib/openai.js";
import { getIndex } from "../lib/pinecone.js";

const TOP_K = 3;
const MIN_SCORE = 0.4;

export type FaqMatch = {
  question: string;
  answer: string;
  score: number;
};

export async function searchFAQ(query: string): Promise<FaqMatch[]> {
  const { data } = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });

  const queryVector = data[0]?.embedding;
  if (!queryVector) throw new Error("Embedding failed");

  const { matches } = await getIndex().query({
    topK: TOP_K,
    vector: queryVector,
    includeMetadata: true,
  });

  return matches.flatMap((match) => {
    const question = match.metadata?.question;
    const answer = match.metadata?.answer;
    const score = match.score;

    if (
      typeof question !== "string" ||
      typeof answer !== "string" ||
      typeof score !== "number" ||
      score < MIN_SCORE
    ) {
      return [];
    }

    return [{ question, answer, score }];
  });
}
