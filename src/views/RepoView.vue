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
        <h1>Repositories for <span class="username">{{ username }}</span></h1>
        <div class="main-content">
            <section class="repos">
                <h2>Repositories</h2>
                <ul v-if="store.repos.length">
                    <li v-for="repo in store.repos" :key="repo.name" :class="{ selected: selectedRepo === repo.name }">
                        <span class="repo-name">{{ repo.name }}</span>
                        <button class="repo-btn fetch-btn" @click="selectedRepo = repo.name; fetchCommits()">Show Commits</button>
                        <p class="repo-desc">{{ repo.description || 'No description' }}</p>
                    </li>
                </ul>
                <p v-else>No repositories found.</p>
            </section>

            <section class="commits" v-if="selectedRepo">
                <h2>Commits for <span class="repo-selected">{{ selectedRepo }}</span></h2>
                <div class="commits-controls">
                    <label for="sortOrder">Sort:</label>
                    <select id="sortOrder" v-model="sortOrder">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
                <ul v-if="store.commits.length" class="commit-list">
                    <li v-for="commit in store.sortedCommits(sortOrder)" :key="commit.sha" class="commit-item">
                        <div class="commit-message">{{ commit.commit.message }}</div>
                        <div class="commit-meta">
                            <span class="commit-author">{{ commit.author?.login || commit.commit.author.name }}</span>
                            <span class="commit-date">{{ new Date(commit.commit.author.date).toLocaleString() }}</span>
                        </div>
                    </li>
                </ul>
                <p v-else class="no-commits">No commits found.</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.repo-view {
    max-width: 1200px;
    margin: 2rem auto;
}
.repo-view h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}
.username {
    color: #1976d2;
}
.main-content {
    display: flex;
    gap: 2rem;
}
.repos {
    flex: 50%;
    border-right: 1px solid #eee;
    padding-right: 2rem;
}
.repos ul {
    list-style: none;
    padding: 0;
}
.repos li {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
}
.repo-desc {
    color: #888;
    font-size: 14px;
}
.commits {
    flex: 50%;
    padding-left: 2rem;
}
.commits-controls {
    margin-bottom: 1rem;
}
.commit-list {
    list-style: none;
    padding: 0;
}
.commit-item {
    margin-bottom: 1.2rem;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 6px;
}
.commit-message {
    font-weight: 500;
    margin-bottom: 0.5rem;
}
.commit-meta {
    font-size: 0.92rem;
    color: #666;
    display: flex;
    gap: 1.5rem;
}
.repo-selected {
    color: #1976d2;
}
.no-commits {
    color: #b71c1c;
    margin-top: 1rem;
}
</style>