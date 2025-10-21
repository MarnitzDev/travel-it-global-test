<script setup lang="ts">

import { ref, computed } from 'vue';
import CommitItem from './CommitItem.vue';
import { useGithubStore } from '../stores/github';
import PaginationControls from './PaginationControls.vue';
import type { Commit } from '../types';


const store = useGithubStore();

const sortBy = ref<'date-desc' | 'date-asc' | 'author'>('date-desc');

const sortedCommits = computed(() => {
  const commits = [...store.commits];
  if (sortBy.value === 'date-desc') {
    return commits.sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime());
  } else if (sortBy.value === 'date-asc') {
    return commits.sort((a, b) => new Date(a.commit.author.date).getTime() - new Date(b.commit.author.date).getTime());
  } else if (sortBy.value === 'author') {
    return commits.sort((a, b) => {
      const aName = a.commit.author.name?.toLowerCase() || '';
      const bName = b.commit.author.name?.toLowerCase() || '';
      return aName.localeCompare(bName);
    });
  }
  return commits;
});

// Accepts a commit SHA string
async function handleSelectCommit(sha: string): Promise<void> {
  if (store.selectedCommit === sha) {
    // Deselect if already selected (toggle off)
    store.setSelectedCommit('');
    return;
  }
  // Set selected first so details view opens immediately
  store.setSelectedCommit(sha);
  await store.fetchCommitDetails(undefined, undefined, sha);
}

async function handlePrev() {
  if (store.page > 1) {
    store.setPage(store.page - 1);
    await store.fetchCommits(store.username, store.selectedRepo, store.page - 1, store.pageSize);
  }
}
async function handleNext() {
  if (store.commits.length === store.pageSize) {
    store.setPage(store.page + 1);
    await store.fetchCommits(store.username, store.selectedRepo, store.page + 1, store.pageSize);
  }
}
</script>

<template>
  <div v-if="store.commits.length">
    <div class="mb-2 flex flex-wrap gap-2 items-center">
      <label class="text-xs text-gray-400">Sort by:</label>
      <select v-model="sortBy" class="text-xs rounded border-gray-600 bg-gray-900 text-white px-2 py-1">
        <option value="date-desc">Newest</option>
        <option value="date-asc">Oldest</option>
      </select>
    </div>
    <ul class="commit-list">
      <CommitItem
        v-for="commit in sortedCommits"
        :key="commit.sha"
        :commit="commit as Commit"
        :selected="store.selectedCommit === commit.sha"
        :details="store.selectedCommit === commit.sha ? store.commitDetails[commit.sha] : undefined"
        @select="handleSelectCommit(commit.sha)"
        @toggle-favorite="store.toggleFavorite(commit as Commit)"
      />
      <PaginationControls
        v-if="store.commits.length >= store.pageSize || store.page > 1"
        :page="store.page"
        :has-next="store.commits.length === store.pageSize"
        @prev="handlePrev"
        @next="handleNext"
      />
    </ul>
  </div>
  <p v-else class="no-commits">No commits found.</p>
</template>

