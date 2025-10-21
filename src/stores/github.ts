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
  /**
   * Set the current GitHub username for API requests.
   */
  function setUsername(name: string) { username.value = name; }

  /**
   * Set the currently selected repository name.
   */
  function setSelectedRepo(repo: string) { selectedRepo.value = repo; }

  /**
   * Set the currently selected commit SHA.
   */
  function setSelectedCommit(sha: string) { selectedCommit.value = sha; }

  /**
   * Set the current page for pagination.
   */
  function setPage(p: number) { page.value = p; }

  /**
   * Set the sort order for commits (newest or oldest).
   */
  function setSortOrder(order: 'newest' | 'oldest') { sortOrder.value = order; }

  /**
   * Fetch repositories for a given username (or current username if not provided).
   * Updates the repos list and username state.
   */
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

  /**
   * Fetch commits for a given user/repo and page.
   * Updates the commits list and selectedRepo/page state.
   */
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

  /**
   * Fetch details for a specific commit by SHA.
   * Updates the commitDetails map and selectedCommit state.
   */
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

  /**
   * Sorts only the currently loaded page of commits (not globally across all pages).
   * For global sorting, all commits would need to be fetched at once, which is not practical for large repos.
   *
   * Recommended approach: Implement sorting on the backend API so that results are returned in the desired order,
   * and pagination works as expected for the sorted dataset.
   */
  function sortedCommits(order?: 'newest' | 'oldest') {
    const useOrder = order || sortOrder.value;
    return [...commits.value].sort((a, b) => {
      const dateA = new Date(a.commit.author.date).getTime();
      const dateB = new Date(b.commit.author.date).getTime();
      return useOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Add a commit to the favorites list, optionally specifying the repo name.
   * Also updates the favorited state on the commit in the current list.
   */
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

  /**
   * Remove a commit from the favorites list by SHA.
   * Also updates the favorited state on the commit in the current list.
   */
  function removeFavorite(sha: string) {
    favorites.value = favorites.value.filter((f) => f.sha !== sha);
    const match = commits.value.find(c => c.sha === sha);
    if (match) match.favorited = false;
  }

  /**
   * Toggle the favorite status of a commit (add or remove from favorites).
   */
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