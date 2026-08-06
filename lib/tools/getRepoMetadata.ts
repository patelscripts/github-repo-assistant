import { tool } from "ai";
import { z } from "zod";
import { fetchRepoMetadata } from "../github";

export const getRepoMetadata = tool({
  description:
    "Get basic info about a GitHub repository — stars, description, language, topics, open issues count",
  inputSchema: z.object({
    owner: z.string().describe("GitHub username or organization name"),
    repo: z.string().describe("Repository name"),
  }),
  execute: async ({ owner, repo }) => {
    try {
      return await fetchRepoMetadata(owner, repo);
    } catch (error) {
      return `Error fetching repo metadata: ${(error as Error).message}`;
    }
  },
});