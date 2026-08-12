import Link from "next/link";
import Chat from "@/components/chat/chat";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-page text-text">
      {/* Landing hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-xs font-mono text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            v0.1 · powered by Gemini 2.5 Flash
          </div>

          {/* Headline */}
          <h1 className="font-sans font-bold tracking-[-0.04em] leading-[0.95] text-6xl sm:text-7xl md:text-8xl text-white">
            Chat with any{" "}
            <span className="font-mono italic font-medium text-text-muted">
              GitHub
            </span>{" "}
            repo.
          </h1>

          {/* Sub-headline */}
          <p className="font-mono text-base sm:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            Ask questions about a repository&apos;s README, file tree, metadata,
            and open issues. RepoGenie fetches the context — you just ask.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto min-w-45 bg-white text-black font-bold font-sans px-8 py-3.5 rounded-md text-sm tracking-wide hover:bg-text-muted transition-colors"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto min-w-45 border border-border-strong text-white font-bold font-sans px-8 py-3.5 rounded-md text-sm tracking-wide hover:bg-surface transition-colors"
            >
              Log in
            </Link>
          </div>

          {/* Footnote */}
          <p className="font-mono text-xs text-text-dim pt-6">
            Free during preview · No credit card required
          </p>
        </div>
      </section>

      {/* Decorative terminal-style feature row */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-text-muted">
          <div className="flex items-start gap-3">
            <span className="text-text-dim">01</span>
            <span>
              <span className="text-white">getReadme</span> · pulls repo README
              on demand
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-text-dim">02</span>
            <span>
              <span className="text-white">getFileStructure</span> · tree of
              the repository
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-text-dim">03</span>
            <span>
              <span className="text-white">getOpenIssues</span> · current
              open issues
            </span>
          </div>
        </div>
      </section>

      {/* Hidden: keep chat reachable after auth without changing the public
          landing experience above. Auth-gated routes render <Chat />. */}
      <div hidden>
        <Chat />
      </div>
    </main>
  );
}
