import type {
  RepoMetadata,
  GithubIssue,
  GithubTreeResponse,
  RawGithubRepo,
  RawGithubIssue,
} from "@/types";

const GITHUB_API = "https://api.github.com";

function githubHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
}

export async function fetchReadme(owner: string, repo: string): Promise<string> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
    headers: {
      ...githubHeaders(),
      Accept: "application/vnd.github.raw+json",
    },
  });

  if (!res.ok) {
    throw new Error(`README fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

export async function fetchRepoMetadata(
  owner: string,
  repo: string
): Promise<RepoMetadata> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: githubHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Repo metadata fetch failed: ${res.status} ${res.statusText}`);
  }

  const data: RawGithubRepo = await res.json();

  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    topics: data.topics,
    defaultBranch: data.default_branch,
    openIssuesCount: data.open_issues_count,
    updatedAt: data.updated_at,
  };
}

export async function fetchFileTree(
  owner: string,
  repo: string,
  branch = "main"
): Promise<string[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: githubHeaders() }
  );

  if (!res.ok) {
    throw new Error(`File tree fetch failed: ${res.status} ${res.statusText}`);
  }

  const data: GithubTreeResponse = await res.json();

  return data.tree
    .filter((item) => item.type === "blob")
    .map((item) => item.path);
}

export async function fetchOpenIssues(
  owner: string,
  repo: string,
  label?: string
): Promise<GithubIssue[]> {
  const url = new URL(`${GITHUB_API}/repos/${owner}/${repo}/issues`);
  url.searchParams.set("state", "open");
  url.searchParams.set("per_page", "10");
  if (label) url.searchParams.set("labels", label);

  const res = await fetch(url, { headers: githubHeaders() });

  if (!res.ok) {
    throw new Error(`Issues fetch failed: ${res.status} ${res.statusText}`);
  }

  const data: RawGithubIssue[] = await res.json();

  return data.map((issue) => ({
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    labels: issue.labels.map((l) => l.name),
  }));
}