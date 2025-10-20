<script setup lang="ts">
import type { Commit } from '../types';
import CommitDetails from './CommitDetails.vue';
const props = defineProps<{
  commit: Commit;
  selected: boolean;
}>();
</script>

<template>
  <li class="commit-item">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <div class="commit-message font-medium">{{ props.commit.commit.message }}</div>
        <div class="commit-meta text-xs text-gray-400">
          <span class="commit-author">{{ props.commit.author?.login || props.commit.commit.author.name }}</span>
          <span class="commit-date ml-2">{{ props.commit.commit.author.date }}</span>
        </div>
      </div>
      <div class="flex flex-row gap-2 md:gap-3 mt-2 md:mt-0">
        <button
          @click="$emit('toggleFavorite', props.commit)"
          class="px-2 py-1 rounded bg-black text-xs text-white hover:bg-gray-800 transition-all border border-gray-700 shadow-sm"
          style="min-height: 1.5rem; line-height: 1;"
        >
          Favorite
        </button>
        <button
          @click="$emit('select', props.commit.sha)"
          class="px-2 py-1 rounded bg-black text-xs text-white hover:bg-gray-800 transition-all border border-gray-700 shadow-sm"
          style="min-height: 1.5rem; line-height: 1;"
        >
          {{ props.selected ? 'Hide Details' : 'View Details' }}
        </button>
      </div>
    </div>
    <CommitDetails v-if="props.selected" :commit="props.commit" />
  </li>
</template>

