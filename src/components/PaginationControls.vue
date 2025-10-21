<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/solid';
const props = defineProps<{
  page: number;
  hasNext: boolean;
}>();
const emit = defineEmits(['prev', 'next']);
</script>

<template>
  <div class="pagination flex items-center gap-2 mt-4">
    <button class="btn flex items-center gap-1" @click="$emit('prev')" :disabled="props.page <= 1">
      <ArrowLeftIcon class="w-5 h-5" />
      <span class="hidden sm:inline">Previous</span>
    </button>
    <span class="px-2 font-semibold">Page {{ props.page }}</span>
    <button class="btn flex items-center gap-1" @click="$emit('next')" :disabled="!props.hasNext">
      <span class="hidden sm:inline">Next</span>
      <ArrowRightIcon class="w-5 h-5" />
    </button>
  </div>
</template>
