<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGithubStore } from '../stores/github';

const route = useRoute();
const store = useGithubStore();

const username = computed(() => route.params.username as string);
const selectedRepo = ref<string>('');
const page = ref(1);
const perPage = 10;

onMounted(async () => {
  await store.fetchRepos(username.value);
});

async function fetchCommits(repoName: string) {
  selectedRepo.value = repoName;
  store.commits = [];
  await store.fetchCommits(username.value, repoName, page.value, perPage);
}
</script>

<template>
    <div class="repo-view">
        <h1>Repositories for {{ username }}</h1>
        <section class="repos">
            <ul v-if="store.repos.length">
                <li v-for="repo in store.repos" :key="repo.name">
                    <p>{{ repo.name }}</p>
                    <p>{{ repo.description }}</p>
                    <button @click="fetchCommits(repo.name)">Fetch Commits</button>
                    <p v-if="selectedRepo === repo.name">{{ store.commits.length ? store.commits : 'No Commits' }}</p>
                </li>
            </ul>
            <p v-else>No repositories found.</p>
        </section>
    </div>
</template>