import MarkdownText from "./MarkdownText.jsx";

// one chat bubble
function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    // user on the right, bot on the left
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-[#6C5CE7] text-white"
            : "rounded-bl-md border border-[#ECEAE5] bg-white text-[#1A1A1A]"
        }`}
      >
        {/* bot answers can have markdown, user text is shown as typed */}
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <MarkdownText text={message.text} />
        )}

        {/* FAQs the bot used, with match score */}
        {message.sources.length > 0 && (
          <div className="mt-3 border-t border-[#ECEAE5] pt-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6C5CE7]">
              Sources
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {message.sources.map((source, index) => (
                <li
                  key={index}
                  className="flex items-center gap-1.5 rounded-full bg-[#F1EEFD] py-1 pl-2.5 pr-1 text-xs font-semibold text-[#4B3FC0]"
                >
                  {source.question}
                  {/* score is 0 to 1, show it as % */}
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[11px] font-bold tabular-nums">
                    {Math.round(source.score * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
