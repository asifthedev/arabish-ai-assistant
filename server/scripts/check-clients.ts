import { openai, EMBEDDING_MODEL } from "../src/lib/openai.js";
import { pinecone } from "../src/lib/pinecone.js";

const checkOpenAIClient = openai.embeddings.create({
  model: EMBEDDING_MODEL,
  input: "test",
});

// error handling later

const checkPineconeClient = pinecone.indexes.list();

try {
  const [response, index] = await Promise.all([
    checkOpenAIClient,
    checkPineconeClient,
  ]);

  console.log("OpenAI client respond with: ", response);
  console.log("Pinecone client respond with: ", index);
} catch (error) {
  console.log((error as Error).message);
}
