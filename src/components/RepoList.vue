<script setup lang="ts">

import { ref } from 'vue';
import type { Repo } from '../types';
import { useUIStore } from '../stores/uiStore.ts';
import { useGithubStore } from '../stores/github';
import CommitList from './CommitList.vue';

const props = defineProps<{
  repos: Repo[];
  username: string;
}>();
const emit = defineEmits<{
  (e: 'select', repoName: string): void;
}>();
const uiStore = useUIStore();
const githubStore = useGithubStore();
const loadingRepo = ref<string | null>(null);
const commitPage = ref(1);
const pageSize = 10;

async function handleSelect(repoName: string) {
  if (uiStore.selections.selectedRepo === repoName) {
    uiStore.setSelection('selectedRepo', '');
    emit('select', '');
    commitPage.value = 1;
  } else {
    uiStore.setSelection('selectedRepo', repoName);
    emit('select', repoName);
    commitPage.value = 1;
    loadingRepo.value = repoName;
    await githubStore.fetchCommits(props.username, repoName, commitPage.value, pageSize);
    loadingRepo.value = null;
  }
}

async function handleCommitPageChange(page: number) {
  commitPage.value = page;
  const selectedRepo = typeof uiStore.selections.selectedRepo === 'string' ? uiStore.selections.selectedRepo : '';
  loadingRepo.value = selectedRepo;
  await githubStore.fetchCommits(props.username, selectedRepo, page, pageSize);
  loadingRepo.value = null;
}
</script>

<template>
  <section class="repos">

    <ul v-if="props.repos.length" class="repos-list space-y-4">
      <li
        v-for="repo in props.repos"
        :key="repo.name"
        :class="[
          'bg-gray-800 rounded-lg shadow p-5 border border-gray-700 transition-all',
          uiStore.selections.selectedRepo === repo.name ? 'ring-2 ring-primary-500' : 'hover:ring-1 hover:ring-primary-400'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold text-lg text-primary-500">{{ repo.name }}</span>
          <button class="btn-primary ml-2" @click="handleSelect(repo.name)">
            {{ uiStore.selections.selectedRepo === repo.name ? 'Hide Commits' : 'Show Commits' }}
          </button>
        </div>
        <p class="text-gray-300 text-sm pr-40">{{ repo.description || 'No description' }}</p>
        <div v-if="uiStore.selections.selectedRepo === repo.name" class="mt-4">
          <CommitList
            :commits="githubStore.commits"
            :page="commitPage"
            :has-next="githubStore.commits.length === pageSize"
            @update:page="handleCommitPageChange"
          />
          <div v-if="loadingRepo === repo.name" class="text-gray-400 text-xs mt-2 flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            Loading...
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="no-repos">No repositories found.</p>
  </section>
</template>
