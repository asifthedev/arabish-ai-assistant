import type OpenAI from "openai";
import { CHAT_MODEL, openai } from "../lib/openai.js";
import { searchFAQ } from "./retrieval.js";

type Source = {
  question: string;
  score: number;
};

type ChatResponse = {
  answer: string;
  responseId: string;
  usedTools: boolean;
  sources: Source[];
};

const MAX_TOOL_ROUNDS = 3;

const instructions = `You are the support assistant for Arabish Academy, an online academy that teaches Arabic and English.
- Reply to greetings and small talk directly, without calling any tool.
- For ANY question about Arabish Academy, call search_faq first.
- Answer ONLY from search_faq results. Keep answers short and friendly.
- If search_faq returns nothing relevant, say you don't have that information and suggest contacting the academy through the website.
- Politely refuse questions unrelated to Arabish Academy.
- Reply in the same language the user writes in.`;

// If our tool schema don't align with the structure defined by OpenAI Responses API we got an error in advance on tool making.
const tools: OpenAI.Responses.FunctionTool[] = [
  {
    type: "function",
    name: "search_faq",
    description:
      "Search the Arabish Academy FAQ. Use for any question about the academy, its courses, students, lessons, or contact.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The user's question, rewritten as a clear search query in English",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    strict: true,
  },
];

export async function handleChat(
  message: string,
  previousResponseId?: string,
): Promise<ChatResponse> {
  let usedTools = false;
  const sources: Source[] = [];

  let response = await openai.responses.create({
    model: CHAT_MODEL,
    instructions,
    tools,
    input: message,
    previous_response_id: previousResponseId ?? null,
  });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const calls = response.output.filter(
      (item) => item.type === "function_call",
    );

    if (calls.length === 0) break;

    usedTools = true;

    const outputs = await Promise.all(
      calls.map(async (call) => {
        const { query } = JSON.parse(call.arguments);
        const results = await searchFAQ(query);

        sources.push(
          ...results.map((result) => ({
            question: result.question,
            score: result.score,
          })),
        );

        return {
          type: "function_call_output" as const,
          call_id: call.call_id,
          output: JSON.stringify(results),
        };
      }),
    );

    response = await openai.responses.create({
      model: CHAT_MODEL,
      instructions: instructions,
      tools: tools,
      input: outputs,
      previous_response_id: response.id,
    });
  }

  return {
    answer: response.output_text,
    responseId: response.id,
    usedTools,
    sources,
  };
}
