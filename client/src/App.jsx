import { useEffect, useRef, useState } from "react";
import ChatMessage from "./components/ChatMessage.jsx";
import ChatInput from "./components/ChatInput.jsx";

// first message the user sees
const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Assalam o Alaikum! I'm the Arabish Academy assistant. Ask me anything about our courses.",
  sources: [],
};

function App() {
  // each message: { role: "user" | "assistant", text, sources }
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // the server sends this back with every answer.
  // we send it with the next question so the bot remembers the chat.
  const [previousResponseId, setPreviousResponseId] = useState(undefined);

  // empty div at the bottom of the list, used for auto scroll
  const bottomRef = useRef(null);

  // scroll down when a new message comes in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text) {
    setError("");

    // show the user's message right away
    setMessages((prev) => [...prev, { role: "user", text, sources: [] }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, previousResponseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // add the bot's answer
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
      setPreviousResponseId(data.responseId);
    } catch (err) {
      setError(err.message || "Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  // reset everything for a fresh chat
  function startNewChat() {
    setMessages([WELCOME_MESSAGE]);
    setPreviousResponseId(undefined);
    setError("");
  }

  return (
    <div className="flex h-screen flex-col bg-[#F6F6F4] text-[#1A1A1A]">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-8">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {isLoading && (
            <p className="animate-pulse text-sm font-medium text-[#6B6B67] motion-reduce:animate-none">
              Typing...
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <ChatInput
        onSend={sendMessage}
        onNewChat={startNewChat}
        disabled={isLoading}
      />
    </div>
  );
}

export default App;
