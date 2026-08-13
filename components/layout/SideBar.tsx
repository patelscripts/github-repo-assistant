"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface ChatSummary {
  _id: string;
  title: string;
  updatedAt: string;
  repoContext?: { owner: string; repo: string } | null;
}

interface SideBarProps {
  activeChatId?: string;
  onNewChat?: () => void;
}

export default function SideBar({ activeChatId, onNewChat }: SideBarProps) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function loadChats() {
      try {
        const res = await fetch("/api/chats", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load chats");
        const data = (await res.json()) as { chats: ChatSummary[] };
        if (!cancelled) setChats(data.chats ?? []);
      } catch {
        if (!cancelled) setChats([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadChats();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
      return;
    }
    router.push("/chat");
  };

  const handleDelete = async (id: string) => {
    setChats((prev) => prev.filter((c) => c._id !== id));
    try {
      await fetch(`/api/chats/${id}`, { method: "DELETE" });
    } catch {
      // best-effort; list is already updated
    }
    if (activeChatId === id) router.push("/chat");
  };

  if (isCollapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center w-12 shrink-0 border-r border-border bg-page py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand sidebar"
          className="cursor-pointer p-2 rounded-md text-text-muted hover:text-text hover:bg-surface transition-colors"
        >
          ▸
        </button>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-page">
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          History
        </span>
        <button
          onClick={() => setIsCollapsed(true)}
          aria-label="Collapse sidebar"
          className="cursor-pointer p-1 rounded text-text-dim hover:text-text hover:bg-surface transition-colors text-xs"
        >
          ◂
        </button>
      </div>

      <div className="px-3 py-3 border-b border-border">
        <button
          onClick={handleNewChat}
          className="cursor-pointer w-full text-xs font-sans font-bold px-3 py-2 rounded-md bg-inverse text-inverse-text hover:bg-text transition-colors"
        >
          + New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {isLoading && (
          <p className="px-2 py-2 font-mono text-xs text-text-dim">loading…</p>
        )}

        {!isLoading && chats.length === 0 && (
          <p className="px-2 py-6 font-mono text-xs text-text-dim text-center">
            no chats yet
          </p>
        )}

        {chats.map((chat) => {
          const isActive = chat._id === activeChatId;
          const repo = chat.repoContext
            ? `${chat.repoContext.owner}/${chat.repoContext.repo}`
            : null;

          return (
            <div
              key={chat._id}
              className={`group flex items-center gap-1 rounded-md transition-colors ${
                isActive
                  ? "bg-surface text-text"
                  : "text-text-muted hover:bg-surface hover:text-text"
              }`}
            >
              <Link
                href={`/chat?c=${chat._id}`}
                className="flex-1 min-w-0 px-2 py-2 font-mono text-xs"
                title={chat.title}
              >
                <span className="block truncate">{chat.title}</span>
                {repo && (
                  <span className="block truncate text-[10px] text-text-dim">
                    {repo}
                  </span>
                )}
              </Link>
              <button
                onClick={() => handleDelete(chat._id)}
                aria-label="Delete chat"
                className="cursor-pointer opacity-0 group-hover:opacity-100 px-2 py-2 text-text-dim hover:text-red-400 transition-all"
              >
                ×
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
