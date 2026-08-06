import { tool } from "ai";
import { z } from "zod";
import { fetchFileTree } from "../github";

export const getFileStructure = tool({
  description:
    "Get the file and folder structure of a GitHub repository, to understand its architecture",
  inputSchema: z.object({
    owner: z.string().describe("GitHub username or organization name"),
    repo: z.string().describe("Repository name"),
    branch: z
      .string()
      .optional()
      .describe("Branch name, defaults to 'main' if not provided"),
  }),
  execute: async ({ owner, repo, branch }) => {
    try {
      const files = await fetchFileTree(owner, repo, branch || "main");
      return files.slice(0, 200);
    } catch (error) {
      return `Error fetching file structure: ${(error as Error).message}`;
    }
  },
});