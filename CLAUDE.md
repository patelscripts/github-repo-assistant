@AGENTS.md

This is a Next.js 16 / AI SDK 7 app — a chat-based GitHub repository assistant
that uses Gemini 2.5 Flash with four GitHub fetch tools
(getReadme, getFileStructure, getRepoMetadata, getOpenIssues) to answer
questions about public repos. See `AGENTS.md` for coding conventions and
architecture details.

## Landing page

`app/(dashboard)/page.tsx` is the public-facing **landing page**, served at
`/`. It is dark-themed (`bg-page` / `text-text` / `text-white` on the
headline) and exposes two CTAs that route unauthenticated users to the
existing pages:

- **Sign up** → `/signup` (`app/(auth)/signup/page.tsx` → `SignUpForm`)
- **Log in** → `/login` (`app/(auth)/login/page.tsx` → `LoginForm`)

## Post-auth redirect

After a successful signup or login, the user is sent to **`/chat`**
(`app/(dashboard)/chat/page.tsx`), which is the auth-gated route that
actually renders `<Chat />`. This is wired up in three places:

- `SignUpForm` — `signIn("credentials", { redirectTo: "/chat" })` and
  `router.push("/chat")` after the credentials call.
- `LoginForm` (credentials) — `router.push("/chat")` on success.
- `LoginForm` (GitHub OAuth) — `signIn("github", { redirectTo: "/chat" })`.

`/chat` is server-side gated: `auth()` is called in the route component
and any unauthenticated visitor is `redirect("/")`-ed back to the
landing page. The public landing page no longer renders `<Chat />` at
all (the previous hidden wrapper has been removed).

### Typography on the landing page

- Headline: `font-sans font-bold tracking-[-0.04em] leading-[0.95]`
  with `text-6xl sm:text-7xl md:text-8xl` scaling.
- The word "GitHub" inside the headline is set in `font-mono italic
  font-medium` for the requested font-styling accent.
- Body copy, badge, and feature row use `font-mono` to match the
  terminal aesthetic used elsewhere in the app.