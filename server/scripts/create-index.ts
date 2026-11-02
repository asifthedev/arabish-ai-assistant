import { pinecone } from "../src/lib/pinecone.js";

const indexModel = await pinecone.indexes.create({
  name: "thearabish-faq",
  schema: {
    fields: {
      _values: { type: "dense_vector", dimension: 1536, metric: "cosine" },
    },
  },
  deployment: { deploymentType: "managed", cloud: "aws", region: "us-east-1" },
  waitUntilReady: true,
});

console.log("Index ready. Add this line to .env:");
console.log(`PINECONE_INDEX_HOST=${indexModel.host}`);
