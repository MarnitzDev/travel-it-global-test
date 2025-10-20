<script setup lang="ts">
import type { Commit } from '../types';
const props = defineProps<{ commit: Commit }>();
</script>

<template>
  <div class="commit-details mt-4 bg-white/5 rounded-xl shadow p-4 border border-gray-700">
    <h3 class="text-base font-semibold mb-2 text-primary-400">Commit Details</h3>
    <div class="text-sm text-gray-200">
      <strong>SHA:</strong> {{ props.commit.sha }}<br />
      <strong>Author:</strong> {{ props.commit.commit.author.name }}<br />
      <strong>Date:</strong> {{ props.commit.commit.author.date }}<br />
      <strong>Message:</strong> {{ props.commit.commit.message }}<br />
      <!-- Add stats/files if available -->
    </div>
  </div>
</template>
