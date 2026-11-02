import { EMBEDDING_MODEL, openai } from "../src/lib/openai.js";
import { getIndex, pinecone, type MetaData } from "../src/lib/pinecone.js";
import fs from "node:fs/promises";

// Loading question answers dataset
const faqsJsonString = await fs.readFile("data/faq.json", "utf-8");

const faqs: MetaData[] = JSON.parse(faqsJsonString);

console.log(`Parsed ${faqs.length} FAQs`);

// 2. Convert every Q&A pair into an embedding (one API call)
const { data } = await openai.embeddings.create({
  model: EMBEDDING_MODEL,
  input: faqs.map(
    (questionAnswerPair) =>
      `Q: ${questionAnswerPair.question}\n${questionAnswerPair.answer}`,
  ),
});

// Build Pinecone record
const records = faqs.map((faq, index) => {
  const embedding = data[index]?.embedding;
  if (!embedding) throw new Error(`No embedding for faq ${index}`);

  return { id: `faq-${index}`, values: embedding, metadata: faq };
});

// Save to Pinecone
await getIndex().upsert({ records });

console.log(`Upserted ${faqs.length} FAQs`);
