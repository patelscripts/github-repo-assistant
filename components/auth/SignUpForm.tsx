"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Signup ho gaya, ab automatically login bhi kar do. Let NextAuth
      // do the redirect — manually calling router.push("/chat") right
      // after can race the session cookie and the /chat auth() gate
      // bounces the user back to /.
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        redirectTo: "/chat",
      });
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm ">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-border bg-surface text-text rounded-md px-3 py-2 text-sm outline-none focus:border-border-strong"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-border bg-surface text-text rounded-md px-3 py-2 text-sm outline-none focus:border-border-strong"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="border border-border bg-surface text-text rounded-md px-3 py-2 text-sm outline-none focus:border-border-strong"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-inverse text-inverse-text px-4 py-2 rounded-md text-sm font-bold disabled:opacity-40"
      >
        {isLoading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}