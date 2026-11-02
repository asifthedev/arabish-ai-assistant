import Markdown from "react-markdown";

// Tailwind removes default list and margin styles,
// so we add our own classes for each markdown tag.
// (react-markdown doesn't render raw HTML, so this is safe)
const components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  // open links in a new tab
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[#6C5CE7] underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[#F6F6F4] px-1 py-0.5 text-[13px]">
      {children}
    </code>
  ),
};

function MarkdownText({ text }) {
  return <Markdown components={components}>{text}</Markdown>;
}

export default MarkdownText;
