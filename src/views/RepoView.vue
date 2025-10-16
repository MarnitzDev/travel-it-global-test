<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGithubStore } from '../stores/github';

const route = useRoute();
const store = useGithubStore();

const username = computed(() => route.params.username as string);
const selectedRepo = ref<string>('');
const sortOrder = ref<'newest' | 'oldest'>('newest');
const page = ref(1);
const perPage = 10;

onMounted(async () => {
  await store.fetchRepos(username.value);
});

async function fetchCommits() {
  if (selectedRepo.value) {
    await store.fetchCommits(username.value, selectedRepo.value, page.value, perPage);
  }
}
</script>

<template>
    <div class="repo-view">
        <h1>Repositories for {{ username }}</h1>
        <section class="repos">
        <h2>Repositories</h2>
        <ul v-if="store.repos.length">
            <li v-for="repo in store.repos" :key="repo.name">
            <button @click="selectedRepo = repo.name; fetchCommits()">{{ repo.name }}</button>
            <p>{{ repo.description || 'No description' }}</p>
            </li>
        </ul>
        <p v-else>No repositories found.</p>
    </section>

    <section class="commits" v-if="selectedRepo">
        <h2>Commits for {{ selectedRepo }}</h2>
        <select v-model="sortOrder">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
        </select>

        <ul v-if="store.commits.length">
            <li v-for="commit in store.sortedCommits(sortOrder)" :key="commit.sha">
                <p><strong>Message:</strong> {{ commit.commit.message }}</p>
                <p><strong>Author:</strong> {{ commit.author?.login || commit.commit.author.name }}</p>
            </li>
        </ul>
        <!-- <p v-else>No commits found.</p> -->
        </section>
    </div>
</template>