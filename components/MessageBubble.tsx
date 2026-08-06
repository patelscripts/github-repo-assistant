interface MessageBubbleProps {
  role: "user" | "assistant" | "system" | "data";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "text-right" : "text-left"}>
      <span
        className={`inline-block rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap ${
          isUser ? "bg-black text-white" : "bg-gray-100 text-black"
        }`}
      >
        {content}
      </span>
    </div>
  );
}