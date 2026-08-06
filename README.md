# Repo Assistant

An AI agent that explains any public GitHub repository in plain language — what it does, how it's structured, and where a new contributor should start.

Built with the [Vercel AI SDK](https://sdk.vercel.ai) and tool calling, so the agent fetches real data from GitHub before answering instead of guessing.

## What it does

Ask it things like:

- `explain facebook/react repo`
- `find good first issues in vercel/next.js`
- `what does this repo's file structure look like`

The agent picks the right tool for the job — pulling the README, file tree, repo metadata, or open issues directly from the GitHub API — and turns that into a clear, beginner-friendly explanation.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Vercel AI SDK** — streaming responses and tool calling
- **Google Gemini** (with Groq as a fallback if quota runs out)
- **Tailwind CSS v4**
- **GitHub REST API** for live repo data

## Tools available to the agent

| Tool | What it fetches |
|---|---|
| `getReadme` | The repository's README content |
| `getFileStructure` | Full file/folder tree, to understand the architecture |
| `getRepoMetadata` | Stars, description, language, topics, open issue count |
| `getOpenIssues` | Open issues, optionally filtered by label (e.g. `good first issue`) |

## Getting started

**1. Clone and install**
```bash
git clone https://github.com/patelscripts/github-repo-assistant.git
cd github-repo-assistant
npm install
```

**2. Set up environment variables**

Create a `.env.local` file in the root:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
GITHUB_TOKEN=your_github_token
```

- Gemini key: [aistudio.google.com](https://aistudio.google.com)
- Groq key: [console.groq.com](https://console.groq.com)
- GitHub token: Settings → Developer settings → Personal access tokens (classic) — only needs the `public_repo` scope

**3. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
├── api/chat/route.ts     # Agent logic — model, system prompt, tools
├── page.tsx               # Entry point
├── layout.tsx              # Fonts, metadata
components/
├── Chat.tsx                # Main chat UI
├── MessageBubble.tsx       # Message rendering (markdown, links, lists)
├── ToolCallIndicator.tsx   # Shows which tool the agent is running
lib/
├── github.ts                # GitHub API helpers
├── validators.ts            # Repo input validation
├── tools/                   # Tool definitions the agent can call
types/
└── index.ts                 # Shared TypeScript types
```

## Notes

- Uses a GitHub personal access token to get a 5,000 requests/hour rate limit instead of the unauthenticated 60/hour.
- No login or sign-up — designed to work instantly, no account needed.
- Falls back from Gemini to Groq automatically if the free tier quota is hit.

## License

MIT