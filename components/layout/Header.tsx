import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-page/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-bold tracking-[-0.04em] text-text"
        >
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="w-2 h-2 rounded-full bg-yellow-300" />
          </span>
          <span className="text-sm">repo-assistant</span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-text-dim font-mono">
            GitHub · Gemini
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          {session?.user ? (
            <>
              <Link
                href="/chat"
                className="px-3 py-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface transition-colors"
              >
                Chat
              </Link>
              <Link
                href="/saved"
                className="px-3 py-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface transition-colors"
              >
                Saved
              </Link>
              <span className="hidden sm:inline-block max-w-37.5 truncate text-text-dim px-2">
                {session.user.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="cursor-pointer px-3 py-1.5 rounded-md border border-border text-text hover:bg-surface transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-md bg-inverse text-inverse-text font-sans font-bold hover:bg-text transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
