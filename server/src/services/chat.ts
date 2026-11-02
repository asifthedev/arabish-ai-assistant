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

// safety limit so the model can't call the tool forever
const MAX_TOOL_ROUNDS = 3;

// rules for the assistant
const instructions = `You are the support assistant for Arabish Academy, an online academy that teaches Arabic and English.
- Reply to greetings and small talk directly, without calling any tool.
- For ANY question about Arabish Academy, call search_faq first.
- Answer ONLY from search_faq results. Keep answers short and friendly.
- You may use simple Markdown (bold, bullet or numbered lists, links) when it makes the answer clearer. Do not use headings or tables.
- If search_faq returns nothing relevant, say you don't have that information and suggest contacting the academy through the website.
- Politely refuse questions unrelated to Arabish Academy.
- Reply in the same language the user writes in.`;

// the one tool the model can use: search our FAQ
// (strict: true makes OpenAI check this schema for us)
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
            "The topic of the user's question as a short English search query, e.g. 'lesson prices and fees' or 'refund policy'. Do NOT include the academy name: every FAQ is about the academy, so the name only hides the right answer.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    strict: true,
  },
];

// send something to the model and get its response
function askModel(
  input: OpenAI.Responses.ResponseInput | string,
  previousResponseId: string | null,
) {
  return openai.responses.create({
    model: CHAT_MODEL,
    instructions,
    tools,
    input,
    // this id lets the model remember the earlier chat
    previous_response_id: previousResponseId,
  });
}

export async function handleChat(
  message: string,
  previousResponseId?: string,
): Promise<ChatResponse> {
  let usedTools = false;
  const sources: Source[] = [];

  // first, send the user's message
  let response = await askModel(message, previousResponseId ?? null);

  // if the model asks for search_faq, run it and send back the results
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const calls = response.output.filter(
      (item) => item.type === "function_call",
    );

    // no tool calls means the model has the final answer
    if (calls.length === 0) break;

    usedTools = true;

    const outputs = await Promise.all(
      calls.map(async (call) => {
        const { query } = JSON.parse(call.arguments);
        const results = await searchFAQ(query);

        // save sources so the UI can show them
        for (const result of results) {
          sources.push({ question: result.question, score: result.score });
        }

        return {
          type: "function_call_output" as const,
          call_id: call.call_id,
          output: JSON.stringify(results),
        };
      }),
    );

    response = await askModel(outputs, response.id);
  }

  return {
    answer: response.output_text,
    responseId: response.id,
    usedTools,
    sources,
  };
}
