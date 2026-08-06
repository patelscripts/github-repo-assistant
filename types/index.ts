export interface RepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  openIssuesCount: number;
  updatedAt: string;
}

export interface GithubIssue {
  number: number;
  title: string;
  url: string;
  labels: string[];
}

export interface GithubTreeItem {
  path: string;
  type: string;
}

export interface GithubTreeResponse {
  tree: GithubTreeItem[];
}

interface RawGithubRepo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  default_branch: string;
  open_issues_count: number;
  updated_at: string;
}

interface RawGithubLabel {
  name: string;
}

interface RawGithubIssue {
  number: number;
  title: string;
  html_url: string;
  labels: RawGithubLabel[];
}

export type { RawGithubRepo, RawGithubIssue, RawGithubLabel };