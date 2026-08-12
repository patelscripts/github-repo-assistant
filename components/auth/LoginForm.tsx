"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Let NextAuth handle the redirect itself — using redirect: false and
    // then router.push() can race the session cookie and the server-side
    // auth() gate in /chat sees no session, bouncing the user back to /.
    // NextAuth will navigate to redirectTo on success and surface a
    // ?error=CredentialsSignin query on failure; we listen for that on
    // mount (see useEffect below) and copy it into local state.
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/chat",
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {/* GitHub login */}
      <button
        onClick={() => signIn("github", { redirectTo: "/chat" })}
        className="bg-inverse text-inverse-text px-4 py-2 rounded-md text-sm font-bold hover:bg-text transition-colors"
      >
        Sign in with GitHub
      </button>

      <div className="flex items-center gap-3 text-text-dim text-xs">
        <div className="flex-1 h-px bg-border" />
        or
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Email/password login */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          className="border border-border bg-surface text-text rounded-md px-3 py-2 text-sm outline-none focus:border-border-strong"
        />

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="border border-border text-text px-4 py-2 rounded-md text-sm font-bold disabled:opacity-40 hover:bg-surface transition-colors"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}