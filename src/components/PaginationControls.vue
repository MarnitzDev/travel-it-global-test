<script setup lang="ts">
const props = defineProps<{
  page: number;
  hasNext: boolean;
}>();
const emit = defineEmits(['prev', 'next']);
</script>

<template>
  <div class="pagination flex items-center gap-2 mt-4">
    <button @click="$emit('prev')" :disabled="props.page <= 1">Previous</button>
    <span>Page {{ props.page }}</span>
    <button @click="$emit('next')" :disabled="!props.hasNext">Next</button>
  </div>
</template>
