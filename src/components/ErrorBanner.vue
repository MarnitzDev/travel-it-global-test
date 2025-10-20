<script setup lang="ts">
const props = defineProps<{ error: string | null }>();
</script>
<template>
  <div v-if="props.error" class="error-banner">
    {{ props.error }}
  </div>
</template>
