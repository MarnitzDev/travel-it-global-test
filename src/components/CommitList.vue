<script setup lang="ts">

import CommitItem from './CommitItem.vue';
import { useGithubStore } from '../stores/github';
import PaginationControls from './PaginationControls.vue';

const store = useGithubStore();

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

function handlePrev() {
  if (store.page > 1) store.setPage(store.page - 1);
}
function handleNext() {
  if (store.commits.length === store.pageSize) store.setPage(store.page + 1);
}
</script>

<template>
  <ul v-if="store.commits.length" class="commit-list">
    <CommitItem
      v-for="commit in store.commits"
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
  <p v-else class="no-commits">No commits found.</p>
</template>

