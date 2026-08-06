"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

// Render **bold** markdown as <strong>. Keeps the agent's formatting
// without pulling in a full markdown library.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl mx-auto bg-page text-text border rounded-lg mt-4 min-h-screen mb-4">
      {/* Title bar */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          </div>
          <h1 className="text-sm font-bold tracking-wide font-sans">
            repo-assistant
          </h1>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-text-dim font-sans">
          GitHub · Gemini
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="space-y-2 font-mono text-sm">
            <p className="text-text-muted">Try one of these:</p>
            <p className="font-bold">
              <span className="text-text-muted">$</span> explain facebook/react
            </p>
            <p className="font-bold">
              <span className="text-text-muted">$</span> find good first issues
              in vercel/next.js
            </p>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          const text = m.parts
            .filter((part) => part.type === "text")
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");

          return (
            <div
              key={m.id}
              className={`flex flex-col gap-1.5 ${
                isUser ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-widest font-sans ${
                  isUser ? "text-text-muted" : "text-text-muted"
                }`}
              >
                {isUser ? "You" : "Agent"}
              </span>
              <div
                className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap rounded-md font-mono ${
                  isUser
                    ? "bg-inverse text-inverse-text"
                    : "bg-surface border border-border text-text"
                }`}
              >
                {renderInline(text)}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="animate-pulse">▸</span> agent is thinking
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 px-5 py-4 border-t border-border bg-page"
      >
        <span className="font-mono text-text-muted select-none">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="explain owner/repo"
          className="flex-1 bg-transparent outline-none text-sm font-mono text-text placeholder:text-text-dim"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer text-xs font-sans font-bold px-4 py-2 rounded-md bg-inverse text-inverse-text disabled:opacity-40 hover:bg-text transition-colors"
        >
          Run
        </button>
      </form>
    </div>
  );
}