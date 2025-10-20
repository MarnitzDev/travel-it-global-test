<script setup lang="ts">
import type { Commit } from '../types';
import CommitItem from './CommitItem.vue';

const props = defineProps<{
  commits: Commit[];
  page: number;
  hasNext: boolean;
}>();
const emit = defineEmits(['toggleFavorite', 'update:page']);

import { ref } from 'vue';
import PaginationControls from './PaginationControls.vue';
const selectedCommit = ref<string>('');

function handleSelectCommit(sha: string) {
  selectedCommit.value = selectedCommit.value === sha ? '' : sha;
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

