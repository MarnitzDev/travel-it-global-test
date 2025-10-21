<script setup lang="ts">
import type { Commit } from '../types';
import CommitDetails from './CommitDetails.vue';
const props = defineProps<{
  commit: Commit;
  selected: boolean;
}>();
</script>

<template>
  <li class="commit-item w-full border-b border-gray-700 pb-4 mb-2">
    <div class="flex flex-row items-center justify-between gap-4 w-full">
      <div class="flex flex-col min-w-0 w-full">
        <div class="commit-message font-medium truncate overflow-ellipsis whitespace-nowrap max-w-2xl md:max-w-3xl lg:max-w-5xl">{{ props.commit.commit.message }}</div>
        <div class="commit-meta text-xs text-gray-400 flex flex-col gap-0 mt-1">
          <span class="commit-author">{{ props.commit.author?.login || props.commit.commit.author.name }}</span>
          <span class="commit-date">{{ props.commit.commit.author.date }}</span>
        </div>
      </div>
      <div class="flex flex-row gap-2">
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
          {{ props.selected ? 'Hide' : 'View' }}
        </button>
      </div>
    </div>
    <CommitDetails v-if="props.selected" :commit="props.commit" />
  </li>
</template>

