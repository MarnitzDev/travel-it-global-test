export interface Repo {
  id?: number;
  name: string;
  description: string | null;
  full_name: string;
}

export interface CommitAuthor {
  name: string;
  date: string;
  email?: string;
}

export interface CommitTree {
  sha: string;
  url: string;
}

export interface CommitCommit {
  author: CommitAuthor;
  message: string;
  tree: CommitTree;
}

export interface Commit {
  sha: string;
  commit: CommitCommit;
  author: { login: string } | null;
}

export interface CommitFile {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
  patch?: string;
}

export interface CommitStats {
  total: number;
  additions: number;
  deletions: number;
}

export interface CommitDetail {
  sha: string;
  commit: CommitCommit;
  files: CommitFile[];
  stats: CommitStats;
}