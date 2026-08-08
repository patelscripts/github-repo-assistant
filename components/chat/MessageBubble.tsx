interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  text: string;
}

function renderInline(text: string) {
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);

  return boldSplit.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const urlSplit = part.split(/(https?:\/\/[^\s)]+)/g);
    return (
      <span key={i}>
        {urlSplit.map((chunk, j) =>
          /^https?:\/\//.test(chunk) ? (
            <a
              key={j}
              href={chunk}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-text-muted transition-colors break-all mb-4"
            >
              {chunk}
            </a>
          ) : (
            <span key={j}>{chunk}</span>
          )
        )}
      </span>
    );
  });
}

// Agar line sirf URL hai (ya "URL:" label ke saath), to true return karta hai
function isUrlOnlyLine(text: string): boolean {
  const trimmed = text.trim();
  return /^(URL:?\s*)?https?:\/\/\S+$/i.test(trimmed);
}

function renderFormatted(text: string) {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-outside ml-4 space-y-1.5 my-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const bulletMatch = line.match(/^\s*[*-]\s+(.*)/);

    if (bulletMatch) {
      const content = bulletMatch[1];

      if (isUrlOnlyLine(content)) {
        // URL wali line ko list ke bahar, bina bullet ke render karte hain
        flushList(`list-${idx}`);
        elements.push(
          <p key={idx} className="text-xs text-text-muted ml-4 -mt-1 mb-1">
            {renderInline(content)}
          </p>
        );
      } else {
        currentList.push(content);
      }
    } else {
      flushList(`list-${idx}`);
      elements.push(
        <p key={idx} className="mb-1">
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList("list-end");

  return elements;
}

export default function MessageBubble({ role, text }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
      <span className="text-[10px] uppercase tracking-widest text-text-muted font-sans">
        {isUser ? "You" : "Agent"}
      </span>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed rounded-md font-mono ${
          isUser
            ? "bg-inverse text-inverse-text"
            : "bg-surface border border-border text-text"
        }`}
      >
        {renderFormatted(text)}
      </div>
    </div>
  );
}