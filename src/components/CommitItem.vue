<script setup lang="ts">

import type { Commit } from '../types';
import CommitDetails from './CommitDetails.vue';
import { useFormatting } from '../composables/useFormatting';
import { useGithubStore } from '../stores/github';
const props = defineProps<{
  commit: Commit;
  selected: boolean;
  details?: any;
}>();
const { formatDate } = useFormatting();
const store = useGithubStore();

import { HeartIcon as HeartSolid, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline';
</script>

<template>
  <li class="commit-item w-full border-b border-gray-700 pb-4 mb-2">
    <div class="flex flex-row items-center justify-between gap-4 w-full">
      <div class="flex flex-col min-w-0 w-full">
        <div class="commit-message font-medium truncate overflow-ellipsis whitespace-nowrap max-w-2xl md:max-w-3xl lg:max-w-5xl">{{ props.commit.commit.message }}</div>
        <div class="commit-meta text-xs text-gray-400 flex flex-col gap-0 mt-1">
          <span class="commit-author">{{ props.commit.author?.login || props.commit.commit.author.name }}</span>
          <span class="commit-date">{{ formatDate(props.commit.commit.author.date) }}</span>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <button
          @click="store.toggleFavorite(props.commit)"
          class="px-2 py-1 rounded bg-black text-xs text-white hover:bg-gray-800 transition-all border border-gray-700 shadow-sm flex items-center gap-1"
          style="min-height: 1.5rem; line-height: 1;"
        >
          <component :is="props.commit.favorited ? HeartSolid : HeartOutline" class="w-4 h-4" :class="props.commit.favorited ? 'text-pink-400' : 'text-gray-400'" />
        </button>
        <button
          @click="$emit('select')"
          class="px-2 py-1 rounded bg-black text-xs text-white hover:bg-gray-800 transition-all border border-gray-700 shadow-sm flex items-center gap-1"
          style="min-height: 1.5rem; line-height: 1;"
        >
          <component :is="props.selected ? EyeSlashIcon : EyeIcon" class="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </div>
  <CommitDetails v-if="props.selected" :commit="props.commit" :details="props.details" />
  </li>
</template>

