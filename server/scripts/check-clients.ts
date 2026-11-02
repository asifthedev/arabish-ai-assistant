// Quick test that the OpenAI and Pinecone keys work.
import { openai, EMBEDDING_MODEL } from "../src/lib/openai.js";
import { pinecone } from "../src/lib/pinecone.js";

try {
  // run both checks at the same time
  const [embedding, indexes] = await Promise.all([
    openai.embeddings.create({ model: EMBEDDING_MODEL, input: "test" }),
    pinecone.indexes.list(),
  ]);

  console.log("OpenAI OK, vector length:", embedding.data[0]?.embedding.length);
  console.log("Pinecone OK, indexes:", indexes);
} catch (error) {
  console.log((error as Error).message);
}
