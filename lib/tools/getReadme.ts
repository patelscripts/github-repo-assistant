import { tool } from "ai";
import { z } from "zod";
import { fetchReadme } from "../github";

export const getReadme = tool({
  description: "Fetch the README content of a GitHub repository",
  inputSchema: z.object({
    owner: z.string().describe("GitHub username or organization name"),
    repo: z.string().describe("Repository name"),
  }),
  execute: async ({ owner, repo }) => {
    try {
      const readme = await fetchReadme(owner, repo);
      return readme.slice(0, 6000);
    } catch (error) {
      return `Error fetching README: ${(error as Error).message}`;
    }
  },
});