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
    <h1>GitHub Commit Explorer</h1>
    <form @submit.prevent="fetchRepos">
      <input v-model="username" placeholder="Enter GitHub username" />
      <button type="submit" class="btn-primary ml-3">Fetch Repositories</button>
      <p v-if="validationError" class="error">{{ validationError }}</p>
      <p v-if="store.error" class="error">{{ store.error }}</p>
    </form>
  </div>
</template>

<style scoped>
.home {
    text-align: center;
    margin: 2rem auto;
}
.home h1 {
    margin-bottom: 1.5rem;
}
</style>
