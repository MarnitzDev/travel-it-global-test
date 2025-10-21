<script setup lang="ts">

import type { Commit } from '../types';
import CommitItem from './CommitItem.vue';
import { useGithubStore } from '../stores/github';
import { useUIStore } from '../stores/uiStore';
import { computed } from 'vue';

const props = defineProps<{
  commits: Commit[];
  page: number;
  hasNext: boolean;
}>();
const emit = defineEmits(['toggleFavorite', 'update:page']);

import { ref } from 'vue';
import PaginationControls from './PaginationControls.vue';
const selectedCommit = ref<string>('');
const githubStore = useGithubStore();
const uiStore = useUIStore();

async function handleSelectCommit(sha: string) {
  if (selectedCommit.value === sha) {
    selectedCommit.value = '';
  } else {
    selectedCommit.value = sha;
    // Fetch commit details if not already loaded
    const repo = typeof uiStore.selections.selectedRepo === 'string' ? uiStore.selections.selectedRepo : '';
    const username = typeof uiStore.selections.username === 'string' ? uiStore.selections.username : '';
    if (repo && username && !githubStore.commitDetails[sha]) {
      await githubStore.fetchCommitDetails(username, repo, sha);
    }
  }
}

function handlePrev() {
  if (props.page > 1) emit('update:page', props.page - 1);
}
function handleNext() {
  if (props.hasNext) emit('update:page', props.page + 1);
}
</script>

<template>
  <ul v-if="props.commits.length" class="commit-list">
    <CommitItem
      v-for="commit in props.commits"
      :key="commit.sha"
      :commit="commit"
      :selected="selectedCommit === commit.sha"
      :details="selectedCommit === commit.sha ? githubStore.commitDetails[commit.sha] : undefined"
      @select="handleSelectCommit(commit.sha)"
      @toggle-favorite="emit('toggleFavorite', commit)"
    />
    <PaginationControls
      v-if="props.commits.length >= 10 || props.page > 1"
      :page="props.page"
      :has-next="props.hasNext"
      @prev="handlePrev"
      @next="handleNext"
    />
  </ul>
  <p v-else class="no-commits">No commits found.</p>
</template>

