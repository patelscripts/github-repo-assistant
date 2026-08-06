import { tool } from "ai";
import { z } from "zod";
import { fetchOpenIssues } from "../github";

export const getOpenIssues = tool({
  description:
    "Get open issues from a GitHub repository, optionally filtered by label (e.g. 'good first issue')",
  inputSchema: z.object({
    owner: z.string().describe("GitHub username or organization name"),
    repo: z.string().describe("Repository name"),
    label: z
      .string()
      .optional()
      .describe("Filter issues by label, e.g. 'good first issue' or 'bug'"),
  }),
  execute: async ({ owner, repo, label }) => {
    try {
      return await fetchOpenIssues(owner, repo, label);
    } catch (error) {
      return `Error fetching issues: ${(error as Error).message}`;
    }
  },
});