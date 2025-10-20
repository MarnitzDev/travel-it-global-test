<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useGithubStore } from '../stores/github';
import { useUIStore } from '../stores/uiStore';
import RepoList from '../components/RepoList.vue';
import CommitList from '../components/CommitList.vue';

const store = useGithubStore();
const uiStore = useUIStore();
const username = ref(typeof uiStore.selections.username === 'string' ? uiStore.selections.username : '');
const selectedCommit = ref('');
const sortOrder = ref<'newest' | 'oldest'>('newest');


onMounted(async () => {
  if (username.value && typeof username.value === 'string') {
    await store.fetchRepos(username.value);
  }
});

watch(() => uiStore.selections.selectedRepo, async (repoName) => {
  if (username.value && typeof username.value === 'string' && repoName) {
    await store.fetchCommits(username.value, repoName as string, 1, 10);
  }
});

function handleUsernameInput(e: Event) {
  username.value = (e.target as HTMLInputElement).value;
}

async function handleFetchRepos() {
  if (username.value && typeof username.value === 'string') {
    uiStore.setSelection('username', username.value);
    await store.fetchRepos(username.value);
  }
}

function handleRepoSelect(repoName: string) {
  uiStore.setSelection('selectedRepo', repoName);
}
</script>
<template>
  <div class="repos-view max-w-3xl mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Repositories</h1>
    <div class="bg-white/5 shadow-xl rounded-2xl p-6 md:p-8 max-w-xl mx-auto mb-8 flex flex-col items-center">
      <div class="flex flex-col md:flex-row items-center gap-3 w-full">
        <input
          v-model="username"
          @input="handleUsernameInput"
          type="text"
          placeholder="Enter GitHub username"
          class="input input-bordered px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring w-full md:w-auto"
        />
        <button
          @click="handleFetchRepos"
          class="btn btn-primary px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 whitespace-nowrap transition-all duration-150"
          style="min-width: 140px; letter-spacing: 0.02em;"
        >
          Fetch Repos
        </button>
      </div>
    </div>
    <div class="bg-white/5 shadow-xl rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mt-8">
      <h2 class="text-xl font-semibold mb-4 text-primary-500 text-center tracking-wide">Repositories</h2>
      <RepoList
        :repos="store.repos"
        :selected-repo="uiStore.selections.selectedRepo"
        :username="username || ''"
        @select="handleRepoSelect"
      />
    </div>
  </div>
</template>
