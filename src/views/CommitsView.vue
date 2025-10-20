<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGithubStore } from '../stores/github';
import CommitList from '../components/CommitList.vue';
import PaginationControls from '../components/PaginationControls.vue';

const store = useGithubStore();
const route = useRoute();
const sortOrder = ref<'newest' | 'oldest'>('newest');
const page = ref(1);
const perPage = 10;

const username = route.params.username as string;
const repo = route.params.repo as string;

onMounted(async () => {
  await store.fetchCommits(username, repo, page.value, perPage);
});

function handleCommitSelect(sha: string) {
  // Implement commit selection logic if needed
}
function handleToggleFavorite(commit: any) {
  // Implement favorite logic if needed
}
function handlePrevPage() {
  if (page.value > 1) {
    page.value--;
    store.fetchCommits(username, repo, page.value, perPage);
  }
}
function handleNextPage() {
  if (store.commits.length === perPage) {
    page.value++;
    store.fetchCommits(username, repo, page.value, perPage);
  }
}
</script>
<template>
  <div class="commits-view max-w-3xl mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Commits for {{ repo }}</h1>
    <CommitList
      :commits="store.sortedCommits(sortOrder)"
      :selected-commit="''"
      @select-commit="handleCommitSelect"
      @toggle-favorite="handleToggleFavorite"
    />
    <PaginationControls
      :page="page"
      :has-next="store.commits.length === perPage"
      @prev="handlePrevPage"
      @next="handleNextPage"
    />
  </div>
</template>
