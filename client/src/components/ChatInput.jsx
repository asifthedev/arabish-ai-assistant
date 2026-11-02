import { useState } from "react";
import { ArrowUp, Plus } from "lucide-react";

// same limit as the server
const MAX_LENGTH = 500;

// message box at the bottom
function ChatInput({ onSend, onNewChat, disabled }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); // stop page reload

    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2">
      <div className="mx-auto flex max-w-2xl items-center gap-1 rounded-full border border-[#ECEAE5] bg-white p-2 transition focus-within:border-[#6C5CE7] focus-within:ring-4 focus-within:ring-[#F1EEFD]">
        {/* type="button" so it doesn't submit the form */}
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#8A8A86] transition hover:bg-[#F6F6F4] hover:text-[#1A1A1A] focus-visible:outline-2 focus-visible:outline-[#6C5CE7]"
        >
          <Plus size={22} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask about Arabish Academy"
          aria-label="Message"
          maxLength={MAX_LENGTH}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#8A8A86] disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7] text-white transition hover:bg-[#5A4BD6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C5CE7] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
