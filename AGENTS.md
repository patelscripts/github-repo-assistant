<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GitHub Repo Assistant — conventions & architecture

## Stack

- **Next.js 16.3.0** (App Router) on React 19.2.8 — bleeding edge, expect API drift from training data. Read `node_modules/next/dist/docs/` before writing route/layout code.
- **AI SDK 7** (`ai`, `@ai-sdk/react`, `@ai-sdk/google`) — `useChat`, `streamText`, `tool`, `UIMessage` shapes may have changed from older examples.
- **Tailwind CSS v4** with `@theme` block in `app/globals.css` (custom tokens: `primary`, `surface`, `borderdim`, `textprimary`, `textmuted`, `accent`, `accentdim`, plus JetBrains Mono).
- **Zod 4** for tool input schemas.
- **TypeScript 5**, strict mode, `moduleResolution: bundler`, path alias `@/*` → `./*` (so `import x from "@/components/chat"` resolves to `./components/chat.tsx`).

## Environment & secrets

- Required env vars in `.env.local` (already gitignored):
  - `GITHUB_TOKEN` — PAT used by `lib/github.ts` for the GitHub REST API. Do not commit this file.
  - `GOOGLE_GENERATIVE_AI_API_KEY` — consumed by the `@ai-sdk/google` provider in `app/api/chat/route.ts`.
- Missing keys will surface as 4xx/5xx from the API route, not as a startup error.

## Architecture

```
app/
  layout.tsx        # Geist font setup, global body wrapper, LayoutProps<"/">
  page.tsx          # Renders <Chat /> as the home page
  globals.css       # Tailwind v4 @theme tokens
  api/chat/route.ts # POST handler: streamText + 4 tools, stopWhen: stepCountIs(5)

components/
  chat.tsx          # Single client component, terminal-styled UI; uses useChat
  RepoInput.tsx     # Standalone repo input (currently NOT wired into chat.tsx)
  MessageBubble.tsx # Standalone message bubble (NOT wired in)
  ErrorBanner.tsx   # Standalone error banner (NOT wired in)
  ToolCallIndicator.tsx # Maps tool names to human labels

lib/
  github.ts         # Raw fetchers: fetchReadme, fetchRepoMetadata, fetchFileTree, fetchOpenIssues
  validators.ts     # isValidRepoFormat, parseRepoInput (accepts "owner/repo" or GitHub URL)
  tools/            # AI SDK tool() definitions — one file per tool, all call into ../github

types/
  index.ts          # Shared types: RepoMetadata, GithubIssue, GithubTreeItem, + Raw* aliases
```

### Route groups (actual layout)

The repo groups auth and the main app separately:

```
app/
  layout.tsx
  globals.css
  api/
    auth/[...nextauth]/  # NextAuth handler (GitHub OAuth + credentials)
    chat/route.ts        # streamText + tools
    repos/               # Saved-repos API
    signup/route.ts      # Email/password signup
  (auth)/
    login/page.tsx       # <LoginForm />
    signup/page.tsx      # <SignupForm />
  (dashboard)/
    page.tsx             # Public landing page (dark theme, white text, two
                         # CTAs: "Sign up" -> /signup, "Log in" -> /login).
                         # Unauthenticated only — does NOT render <Chat />.
    chat/page.tsx        # Auth-gated chat experience (calls auth() in the
                         # server component and redirects "/" if no
                         # session). SignUpForm, LoginForm, and the GitHub
                         # OAuth button all redirectTo="/chat" on success.
    saved/               # Saved repos (auth-gated)
```

### Auth flow

- Public landing page lives at `/` (`(dashboard)/page.tsx`).
- `/login` and `/signup` are the credential screens. Successful auth
  (or GitHub OAuth via the button on the login form) sends the user to
  `/chat`.
- `/chat` is the only route that renders `<Chat />`. It is server-gated
  by `auth()` from `lib/auth.ts` — unauthenticated visitors are bounced
  back to `/`.
- Do **not** render `<Chat />` on the landing page. The marketing page
  and the chat experience are separate routes on purpose.

When you add a public-facing screen, put it under `(dashboard)/` and keep
the auth screens under `(auth)/`. The root `/` URL is the landing page
defined in `app/(dashboard)/page.tsx` — it is the first thing a visitor
sees and is dark by design (`bg-page` / `text-text` / `text-white` on
the headline). Do **not** route `/` straight to `<Chat />` without
considering unauthenticated visitors.

### Request flow

1. User types in `components/chat.tsx`, which calls `useChat` with a `DefaultChatTransport` pointing at `/api/chat`.
2. `app/api/chat/route.ts` calls `streamText` with model `google("gemini-2.5-flash")` and the four tools. The agent has a system prompt instructing it to always call tools before answering.
3. `stopWhen: stepCountIs(5)` caps the tool-call chain.
4. Streamed UIMessages render back in `Chat`; text parts are concatenated per message.

### Adding a new tool

1. Add the fetcher to `lib/github.ts` (typed via `types/index.ts`).
2. Create `lib/tools/<name>.ts` — export `const <name> = tool({ description, inputSchema: z.object({...}), execute })`. Wrap `execute` in `try/catch` and return `"Error fetching ...: <msg>"` strings so the agent sees a clean failure.
3. Import + register the tool in `app/api/chat/route.ts` under the `tools` object.
4. Add a label mapping in `components/ToolCallIndicator.tsx` if you want the UI to show progress for it.

## Conventions

- **Styling**: Tailwind utility classes; reuse theme tokens (`bg-primary`, `text-accent`, etc.) instead of raw hex. The aesthetic is terminal-style monospace — keep that consistent.
- **Server vs client**: `app/api/chat/route.ts` is server-only (uses `@ai-sdk/google`). Components that touch `useChat` must start with `"use client"`. Anything else can stay a server component.
- **Type safety**: prefer the shared `types/index.ts` interfaces over inline shapes. Raw GitHub responses get mapped to clean types in `lib/github.ts` — keep that boundary clean.
- **Imports**: use the `@/` alias, not relative `../../../`.
- **Validation**: route-level input parsing belongs in `lib/validators.ts`. Repo inputs accept `owner/repo` or a full `https://github.com/owner/repo` URL.

## Known WIP

- `components/RepoInput.tsx`, `components/MessageBubble.tsx`, and `components/ErrorBanner.tsx` exist but are not imported by `chat.tsx`. Don't duplicate their functionality in `chat.tsx` — if you need that UI, wire them in instead of re-implementing.
- `README.md` still has the boilerplate "Create Next App" content and should be replaced with a real project description when ready.
- `app/(dashboard)/page.tsx` is the **public landing page**. It is dark
  with white headline text and two CTAs (`/signup`, `/login`). The chat
  experience itself lives at `/chat` (auth-gated). Do not put `<Chat />`
  on the landing page — that work belongs on `/chat`.