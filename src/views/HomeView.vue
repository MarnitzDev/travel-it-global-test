<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGithubStore } from '../stores/github.ts';
import { ArrowPathIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const store = useGithubStore();

const username = ref<string>('');

const validationError = ref<string | null>(null);
const loading = ref(false);

async function fetchRepos() {
  if (!username.value.trim()) {
    validationError.value = 'Username is required';
    return;
  }
  validationError.value = null;
  loading.value = true;
  await store.fetchRepos(username.value);
  loading.value = false;
  if (!store.error) {
    router.push({ name: 'repos', params: { username: username.value } });
  }
}
</script>

<template>
  <div class="text-center mx-auto mt-8 mb-8">
    <h1 class="mt-48 mb-6 text-2xl md:text-4xl">GitHub Commit Explorer</h1>
    <div class="mx-auto max-w-md bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <form @submit.prevent="fetchRepos">
        <input v-model="username" placeholder="Enter GitHub username" class="w-full" />
        <button type="submit" class="btn-primary mt-4 w-full" :disabled="loading">
          <span v-if="loading" class="inline-flex items-center justify-center">
            <ArrowPathIcon class="animate-spin h-5 w-5 mr-2 text-white" />
            Loading...
          </span>
          <span v-else>Fetch Repositories</span>
        </button>
        <p v-if="validationError" class="error mt-2 text-red-400">{{ validationError }}</p>
        <p v-if="store.error" class="error mt-2 text-red-400">{{ store.error }}</p>
      </form>
    </div>
  </div>
</template>
