<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGithubStore } from '../stores/github';

const route = useRoute();
const store = useGithubStore();

const username = computed(() => route.params.username as string);

onMounted(async () => {
  await store.fetchRepos(username.value);
});
</script>

<template>
    <div class="repo-view">
        <h1>Repositories for {{ username }}</h1>
        
        <section class="repos">
            <h2>Repositories</h2>
            <ul v-if="store.repos.length">
                <li v-for="repo in store.repos" :key="repo.name">
                    <p>{{ repo.name }}</p>
                </li>
            </ul>
            <p v-else>No repositories found.</p>
        </section>
    </div>
</template>