<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import type { Repo } from '../types';
import { useGithubStore } from '../stores/github';
import CommitList from './CommitList.vue';

const props = defineProps<{ repos: Repo[]; username: string }>();
const store = useGithubStore();

async function handleSelect(repoName: string) {
  if (store.selectedRepo === repoName) {
    store.setSelectedRepo('');
    store.commits = [];
    store.setPage(1);
  } else {
    store.setSelectedRepo(repoName);
    store.setPage(1);
    await store.fetchCommits(props.username, repoName, 1, store.pageSize);
  }
}
</script>

<template>
  <section class="repos">

    <ul v-if="props.repos.length" class="repos-list space-y-4">
      <li
        v-for="repo in props.repos"
        :key="repo.name"
        :class="[
          'bg-gray-00 rounded-lg shadow p-5 border border-gray-700 transition-all',
          store.selectedRepo === repo.name ? 'ring-1 ring-gray-500' : 'hover:ring-1 hover:ring-gray-600'
        ]"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <span class="font-semibold text-lg text-primary-500 flex items-center gap-1">
            {{ repo.name }}
            <a
              :href="`https://github.com/${props.username}/${repo.name}`"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-1 p-1 rounded hover:bg-blue-900/30 transition-colors"
              :title="`Open ${repo.name} on GitHub`"
            >
              <ArrowTopRightOnSquareIcon class="w-5 h-5 text-blue-400" />
            </a>
          </span>
          <button
            class="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-xs text-white border border-gray-600 shadow-sm hover:bg-gray-700 transition-all h-7 min-h-0 max-w-fit sm:max-w-none"
            style="font-size: 0.85rem; line-height: 1;"
            @click="handleSelect(repo.name)"
          >
            <span>{{ store.selectedRepo === repo.name ? 'Hide Commits' : 'Show Commits' }}</span>
            <component :is="store.selectedRepo === repo.name ? ChevronUpIcon : ChevronDownIcon" class="w-4 h-4" />
          </button>
        </div>
        <p class="text-gray-300 text-sm w-full break-words max-w-2xl sm:max-w-3xl">{{ repo.description || 'No description' }}</p>
        <div v-if="store.selectedRepo === repo.name" class="mt-4">
          <CommitList />
          <div v-if="store.loading" class="text-gray-400 text-xs mt-2 flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            Loading...
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="no-repos">No repositories found.</p>
  </section>
</template>
