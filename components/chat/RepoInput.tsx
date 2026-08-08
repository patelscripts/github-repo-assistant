"use client";

import { useState } from "react";

interface RepoInputProps {
  onSubmit: (repoText: string) => void;
}

export default function RepoInput({ onSubmit }: RepoInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(`Explain the ${value.trim()} repo`);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="owner/repo (e.g. facebook/react)"
        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="submit"
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
      >
        Quick explain
      </button>
    </form>
  );
}