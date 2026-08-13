import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function SavedPage() {
  // Auth gate: same shape as /chat — unauthenticated visitors go back to /.
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
      <header className="mb-8 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          /saved
        </p>
        <h1 className="font-sans font-bold tracking-[-0.04em] text-4xl text-white">
          Saved <span className="font-mono italic font-medium text-text-muted">repos</span>
        </h1>
        <p className="font-mono text-sm text-text-muted">
          Repos you&apos;ve bookmarked for quick access from the chat.
        </p>
      </header>

      <section className="border border-border rounded-lg bg-surface">
        <div className="px-5 py-12 text-center space-y-3">
          <p className="font-mono text-sm text-text-muted">no saved repos yet</p>
          <p className="font-mono text-xs text-text-dim">
            Star a repo from the chat input to see it here.
          </p>
          <Link
            href="/chat"
            className="inline-block mt-4 font-sans font-bold text-sm px-4 py-2 rounded-md bg-inverse text-inverse-text hover:bg-text transition-colors"
          >
            Open chat
          </Link>
        </div>
      </section>
    </main>
  );
}
