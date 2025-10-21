import type { Repo, Commit, CommitDetail } from '../types';

export interface GitProvider {
  fetchRepos(username: string): Promise<Repo[]>;
  fetchCommits(username: string, repo: string, page?: number, perPage?: number): Promise<Commit[]>;
  fetchCommitDetails(username: string, repo: string, sha: string): Promise<CommitDetail>;
}

export class GithubProvider implements GitProvider {
  private apiBase = import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com';
  private token = import.meta.env.VITE_GITHUB_TOKEN;

  private getHeaders(): Record<string, string> {
    return this.token ? { Authorization: `token ${this.token}` } : {};
  }

  async fetchRepos(username: string): Promise<Repo[]> {
    const response = await fetch(`${this.apiBase}/users/${username}/repos`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      let msg = 'Failed to fetch repositories';
      try {
        const data = await response.json();
        if (data && data.message) msg = data.message;
      } catch {}
      throw new Error(msg);
    }
    return response.json();
  }

  async fetchCommits(username: string, repo: string, page = 1, perPage = 10): Promise<Commit[]> {
    const response = await fetch(`${this.apiBase}/repos/${username}/${repo}/commits?page=${page}&per_page=${perPage}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      let msg = 'Failed to fetch commits';
      try {
        const data = await response.json();
        if (data && data.message) msg = data.message;
      } catch {}
      throw new Error(msg);
    }
    return response.json();
  }

  async fetchCommitDetails(username: string, repo: string, sha: string): Promise<CommitDetail> {
    const response = await fetch(`${this.apiBase}/repos/${username}/${repo}/commits/${sha}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      let msg = 'Failed to fetch commit details';
      try {
        const data = await response.json();
        if (data && data.message) msg = data.message;
      } catch {}
      throw new Error(msg);
    }
    return response.json();
  }
}
