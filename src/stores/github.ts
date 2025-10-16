// src/stores/github.ts

import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Repo, Commit } from '../types.ts';

const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com';

export const useGithubStore = defineStore('github', () => {
  const repos = ref<Repo[]>([]);
  const commits = ref<Commit[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);

  // Action to fetch repositories
  async function fetchRepos(username: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos`);
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

  // Action to fetch commits with pagination
  async function fetchCommits(username: string, repo: string, page = 1, perPage = 10) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/commits?page=${page}&per_page=${perPage}`
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

  return {
    repos,
    commits,
    error,
    loading,
    fetchRepos,
    fetchCommits,
  };
});