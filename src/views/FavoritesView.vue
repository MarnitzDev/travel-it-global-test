<script setup lang="ts">
import { useGithubStore } from '../stores/github';
import { TrashIcon } from '@heroicons/vue/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
const store = useGithubStore();
import { useFormatting } from '../composables/useFormatting';
const { formatDate } = useFormatting();
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
            <span class="font-semibold text-lg text-primary-500 flex items-center gap-1">
              {{ fav.repository?.name }}
              <a
                v-if="fav.repository && typeof fav.repository === 'object' && 'name' in fav.repository"
                :href="`https://github.com/${('owner' in fav.repository && fav.repository.owner && typeof fav.repository.owner === 'object' && 'login' in fav.repository.owner ? fav.repository.owner.login : store.username)}/${fav.repository.name}`"
                target="_blank"
                rel="noopener noreferrer"
                class="ml-1 p-1 rounded hover:bg-blue-900/30 transition-colors"
                :title="`Open ${fav.repository.name} on GitHub`"
              >
                <ArrowTopRightOnSquareIcon class="w-5 h-5 text-blue-400" />
              </a>
            </span>
            <div class="text-lg font-mono text-white break-words truncate max-w-full">{{ fav.commit.message }}</div>
            <div class="text-sm text-gray-400 mt-1 break-words">
              by {{ fav.author?.login || fav.commit.author.name }} on {{ formatDate(fav.commit.author.date) }}
            </div>
          </div>
          <div class="mt-2 md:mt-0 flex items-center space-x-2">
            <button
              @click="store.removeFavorite(fav.sha)"
              class="px-3 py-1 rounded-lg font-semibold text-white shadow hover:bg-red-700 hover:cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <TrashIcon class="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>