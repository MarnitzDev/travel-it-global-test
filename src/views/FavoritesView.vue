<script setup lang="ts">
import { useGithubStore } from '../stores/github';
const store = useGithubStore();

// Optionally, add logic for removing favorites or viewing details
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Favorite Commits</h1>
    <div v-if="store.favorites.length === 0" class="text-gray-400 text-center py-8">
      No favorites yet.
    </div>
    <ul v-else class="space-y-4">
      <li v-for="fav in store.favorites" :key="fav.sha" class="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow overflow-x-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div class="min-w-0">
            <div class="font-semibold text-primary-500 break-words">{{ fav.repository?.name }}</div>
            <div class="text-lg font-mono text-white break-words truncate max-w-full">{{ fav.commit.message }}</div>
            <div class="text-sm text-gray-400 mt-1 break-words">
              by {{ fav.author?.login || fav.commit.author.name }} on {{ fav.commit.author.date }}
            </div>
          </div>
          <div class="mt-2 md:mt-0 flex items-center space-x-2">
            <button @click="store.removeFavorite(fav.sha)" class="btn-danger px-3 py-1 rounded hover:bg-red-700 transition-colors">Remove</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>
