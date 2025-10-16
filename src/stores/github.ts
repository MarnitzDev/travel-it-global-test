import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Repo, Commit, CommitDetail } from '../types.ts';

// Extended type for favorite commits
export interface FavoriteCommit extends Commit {
  repository: { name: string };
}


const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const useGithubStore = defineStore('github', () => {
  const repos = ref<Repo[]>([]);
  const commits = ref<Commit[]>([]);
  const favorites = ref<FavoriteCommit[]>([]);
  const commitDetails = ref<Record<string, CommitDetail>>({});
  const error = ref<string | null>(null);
  const loading = ref(false);

  // Fetch repositories for a given username from GitHub API
  // Handles loading, error, and updates repos state
  async function fetchRepos(username: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos`, {
        headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error('User not found');
        if (response.status === 403) throw new Error('API rate limit exceeded');
        throw new Error('Failed to fetch repositories');
      }
      repos.value = await response.json();
    } catch (err) {
      error.value = (err as Error).message;
      repos.value = [];
    } finally {
      loading.value = false;
    }
  }

  // Fetch commits for a repo (with pagination) from GitHub API
  // Handles loading, error, and updates commits state
  async function fetchCommits(username: string, repo: string, page = 1, perPage = 10) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo}/commits?page=${page}&per_page=${perPage}`,
        {
          headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}
        }
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error('API rate limit exceeded');
        throw new Error('Failed to fetch commits');
      }
      commits.value = await response.json();
    } catch (err) {
      error.value = (err as Error).message;
      commits.value = [];
    } finally {
      loading.value = false;
    }
  }

  // Fetch commit details (files changed, stats) for a commit from GitHub API
  // Handles loading, error, and updates commitDetails state
  async function fetchCommitDetails(username: string, repo: string, sha: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/commits/${sha}`
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error('API rate limit exceeded');
        throw new Error('Failed to fetch commit details');
      }
      const data = await response.json();
      commitDetails.value[sha] = data;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  // Sorts commits by date (newest or oldest)
  function sortedCommits(sortOrder: 'newest' | 'oldest' = 'newest') {
    return [...commits.value].sort((a, b) => {
      const dateA = new Date(a.commit.author.date).getTime();
      const dateB = new Date(b.commit.author.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  // Add a commit to favorites (persisted)
  function addFavorite(commit: Commit, repoName?: string) {
    if (!favorites.value.some((f) => f.sha === commit.sha)) {
      const favorite: FavoriteCommit = {
        ...commit,
        repository: { name: repoName || '' }
      };
      favorites.value.push(favorite);
    }
  }

  // Remove a commit from favorites
  function removeFavorite(sha: string) {
    favorites.value = favorites.value.filter((f) => f.sha !== sha);
  }

  return {
    repos,
    commits,
    favorites,
    commitDetails,
    error,
    loading,
    fetchRepos,
    fetchCommits,
    fetchCommitDetails,
    sortedCommits,
    addFavorite,
    removeFavorite
  };
}, {
  persist: true, // Persist favorites using pinia-plugin-persistedstate
});