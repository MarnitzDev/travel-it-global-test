import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Repo, Commit } from '../types.ts';


const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

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

  // Action to fetch commits with pagination
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

  // Function to get sorted commits by order
  function sortedCommits(sortOrder: 'newest' | 'oldest' = 'newest') {
    return [...commits.value].sort((a, b) => {
      const dateA = new Date(a.commit.author.date).getTime();
      const dateB = new Date(b.commit.author.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  return {
    repos,
    commits,
    error,
    loading,
    fetchRepos,
    fetchCommits,
    sortedCommits
  };
});