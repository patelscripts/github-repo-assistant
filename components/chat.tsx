"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import MessageBubble from "./MessageBubble";
import ToolCallIndicator from "./ToolCallIndicator";

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

  // Agent ka last message check kar raha hai koi tool abhi chal raha hai ya nahi
  const lastMessage = messages[messages.length - 1];
  const activeTool =
    lastMessage?.role === "assistant"
      ? lastMessage.parts.find(
          (part) =>
            part.type.startsWith("tool-") &&
            "state" in part &&
            part.state !== "output-available"
        )
      : undefined;
  const activeToolName = activeTool?.type.replace("tool-", "");

  return (
    <div className="flex flex-col min-h-screen w-full max-w-3xl mx-auto bg-page text-text border rounded-lg m-4">
      {/* Title bar */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
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
          const text = m.parts
            .filter((part) => part.type === "text")
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");

          return (
            <MessageBubble
              key={m.id}
              role={m.role as "user" | "assistant" | "system"}
              text={text}
            />
          );
        })}

        {isLoading && activeToolName && <ToolCallIndicator toolName={activeToolName} />}
        {isLoading && !activeToolName && (
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