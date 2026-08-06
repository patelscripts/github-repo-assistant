"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">GitHub Repo Assistant</h1>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm">
            Try: &quot;explain facebook/react repo&quot; or &quot;find good first issues in vercel/next.js&quot;
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap ${
                m.role === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
            >
              {m.parts
                .filter((part) => part.type === "text")
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")}
            </span>
          </div>
        ))}

        {isLoading && <p className="text-sm text-gray-400 italic">Thinking...</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. explain facebook/react repo"
          className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}