// Loads data/faq.json into Pinecone.
// Run again any time you change the FAQ file.
import fs from "node:fs/promises";
import { EMBEDDING_MODEL, openai } from "../src/lib/openai.js";
import { getIndex, type MetaData } from "../src/lib/pinecone.js";

// 1. read the FAQ file
const fileText = await fs.readFile("data/faq.json", "utf-8");
const faqs: MetaData[] = JSON.parse(fileText);

console.log(`Parsed ${faqs.length} FAQs`);

// 2. turn every question + answer into a vector (one API call for all)
const { data } = await openai.embeddings.create({
  model: EMBEDDING_MODEL,
  input: faqs.map((faq) => `Q: ${faq.question}\n${faq.answer}`),
});

// 3. build the records for Pinecone
const records = faqs.map((faq, index) => {
  const embedding = data[index]?.embedding;
  if (!embedding) throw new Error(`No embedding for faq ${index}`);

  // same id every run, so old records get replaced, not duplicated
  return { id: `faq-${index}`, values: embedding, metadata: faq };
});

// 4. save them
await getIndex().upsert({ records });

console.log(`Upserted ${faqs.length} FAQs`);
