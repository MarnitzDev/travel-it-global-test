<script setup lang="ts">
import { onMounted } from 'vue';
import { useGithubStore } from '../stores/github';
import RepoList from '../components/RepoList.vue';

const store = useGithubStore();

onMounted(async () => {
  if (store.username) {
    await store.fetchRepos();
  }
});
</script>
<template>
  <div class="repos-view mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Repositories</h1>
    <div class="bg-white/5 shadow-xl rounded-2xl p-6 md:p-8 max-w-xl mx-auto mb-8 flex flex-col items-center">
      <div class="flex flex-col md:flex-row items-center gap-3 w-full">
        <input
          v-model="store.username"
          type="text"
          placeholder="Enter GitHub username"
          class="input input-bordered px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring w-full md:w-auto"
        />
        <button
          @click="store.fetchRepos()"
          class="btn btn-primary px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 whitespace-nowrap transition-all duration-150"
          style="min-width: 140px; letter-spacing: 0.02em;"
        >
          Fetch Repos
        </button>
      </div>
    </div>
  <div class="bg-white/5 shadow-xl rounded-2xl p-6 md:p-8 max-w-5xl w-full mx-auto mt-8">
      <h2 class="text-xl font-semibold mb-4 text-primary-500 text-center tracking-wide">Repositories</h2>
      <RepoList
        :repos="store.repos"
        :username="store.username"
      />
    </div>
  </div>
</template>
