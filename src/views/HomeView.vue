<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGithubStore } from '../stores/github.ts';

const router = useRouter();
const store = useGithubStore();

const username = ref<string>('');
const validationError = ref<string | null>(null);

async function fetchRepos() {
  if (!username.value.trim()) {
    validationError.value = 'Username is required';
    return;
  }
  validationError.value = null;
  await store.fetchRepos(username.value);
  if (!store.error) {
    router.push({ name: 'repos', params: { username: username.value } });
  }
}
</script>

<template>
    <div class="home">
    <h1
      class="mb-3 md:mb-4 text-2xl md:text-4xl"
    >
      GitHub Commit Explorer
    </h1>
    <div class="mx-auto max-w-md bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <form @submit.prevent="fetchRepos">
        <input v-model="username" placeholder="Enter GitHub username" class="w-full" /> 
        <button type="submit" class="btn-primary mt-4 w-full">Fetch Repositories</button>
        <p v-if="validationError" class="error mt-2 text-red-400">{{ validationError }}</p>
        <p v-if="store.error" class="error mt-2 text-red-400">{{ store.error }}</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
    text-align: center;
    margin: 2rem auto;
}
.home h1 {
    margin-bottom: 1.5rem;
}
</style>
