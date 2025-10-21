import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { Repo, Commit, CommitDetail } from '../types.ts';
import { GithubProvider } from '../providers/gitProvider';

// Extended type for favorite commits
interface FavoriteCommit extends Commit {
  repository: { name: string };
}

const provider = new GithubProvider();

export const useGithubStore = defineStore('github', () => {
  // Data
  const repos = ref<Repo[]>([]);
  const commits = ref<Commit[]>([]);
  const favorites = ref<FavoriteCommit[]>([]);
  const commitDetails = ref<Record<string, CommitDetail>>({});
  const error = ref<string | null>(null);
  const loading = ref(false);

  // UI/logic state
  const username = ref('');
  const selectedRepo = ref('');
  const selectedCommit = ref('');
  const page = ref(1);
  const pageSize = ref(10);
  const sortOrder = ref<'newest' | 'oldest'>('newest');

  // Keep commit favorited state in sync with favorites
  watch(favorites, (newFavs: FavoriteCommit[]) => {
    const favShas = new Set(newFavs.map(f => f.sha));
    for (const c of commits.value) {
      c.favorited = favShas.has(c.sha);
    }
  }, { deep: true });

  // Actions
  function setUsername(name: string) { username.value = name; }
  function setSelectedRepo(repo: string) { selectedRepo.value = repo; }
  function setSelectedCommit(sha: string) { selectedCommit.value = sha; }
  function setPage(p: number) { page.value = p; }
  function setSortOrder(order: 'newest' | 'oldest') { sortOrder.value = order; }

  async function fetchRepos(name?: string) {
    loading.value = true;
    error.value = null;
    try {
      const user = name ?? username.value;
      repos.value = await provider.fetchRepos(user);
      username.value = user;
    } catch (err) {
      error.value = (err as Error).message;
      repos.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchCommits(user?: string, repoName?: string, p?: number, perPage?: number) {
    loading.value = true;
    error.value = null;
    try {
      const userVal = user ?? username.value;
      const repoVal = repoName ?? selectedRepo.value;
      const pageVal = p ?? page.value;
      const pageSizeVal = perPage ?? pageSize.value;
      commits.value = await provider.fetchCommits(userVal, repoVal, pageVal, pageSizeVal);
      selectedRepo.value = repoVal;
      page.value = pageVal;
    } catch (err) {
      error.value = (err as Error).message;
      commits.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchCommitDetails(user?: string, repoName?: string, sha?: string) {
    loading.value = true;
    error.value = null;
    try {
      const userVal = user ?? username.value;
      const repoVal = repoName ?? selectedRepo.value;
      const shaVal = sha ?? selectedCommit.value;
      commitDetails.value[shaVal] = await provider.fetchCommitDetails(userVal, repoVal, shaVal);
      selectedCommit.value = shaVal;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  function sortedCommits(order?: 'newest' | 'oldest') {
    const useOrder = order || sortOrder.value;
    return [...commits.value].sort((a, b) => {
      const dateA = new Date(a.commit.author.date).getTime();
      const dateB = new Date(b.commit.author.date).getTime();
      return useOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  function addFavorite(commit: Commit, repoName?: string) {
    if (!favorites.value.some((f) => f.sha === commit.sha)) {
      const favorite: FavoriteCommit = {
        ...commit,
        repository: { name: repoName || selectedRepo.value || '' }
      };
      favorites.value.push(favorite);
      const match = commits.value.find(c => c.sha === commit.sha);
      if (match) match.favorited = true;
    }
  }

  function removeFavorite(sha: string) {
    favorites.value = favorites.value.filter((f) => f.sha !== sha);
    const match = commits.value.find(c => c.sha === sha);
    if (match) match.favorited = false;
  }

  function toggleFavorite(commit: Commit) {
    if (favorites.value.some((f) => f.sha === commit.sha)) {
      removeFavorite(commit.sha);
      commit.favorited = false;
    } else {
      addFavorite(commit);
      commit.favorited = true;
    }
  }

  return {
    repos,
    commits,
    favorites,
    commitDetails,
    error,
    loading,
    username,
    selectedRepo,
    selectedCommit,
    page,
    pageSize,
    sortOrder,
    setUsername,
    setSelectedRepo,
    setSelectedCommit,
    setPage,
    setSortOrder,
    fetchRepos,
    fetchCommits,
    fetchCommitDetails,
    sortedCommits,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}, { persist: true });