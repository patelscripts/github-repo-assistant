export function isValidRepoFormat(input: string): boolean {
  const repoPattern = /^[\w.-]+\/[\w.-]+$/;
  return repoPattern.test(input.trim());
}

export function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const cleaned = input.trim().replace(/^https?:\/\/github\.com\//, "");

  if (!isValidRepoFormat(cleaned)) {
    return null;
  }

  const [owner, repo] = cleaned.split("/");
  return { owner, repo };
}