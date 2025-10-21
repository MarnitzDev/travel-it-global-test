<script setup lang="ts">
import type { Commit, CommitDetail } from '../types';
import { useFormatting } from '../composables/useFormatting';
const props = defineProps<{ commit: Commit; details?: CommitDetail }>();
const { formatDate } = useFormatting();
import { ArrowPathIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <div class="commit-details mt-4 bg-white/5 rounded-xl shadow p-4 border border-gray-700">
    <h3 class="text-base font-semibold mb-2 text-primary-400">Commit Details</h3>
    <div class="text-sm text-gray-200">
      <strong>SHA:</strong> {{ props.commit.sha }}<br />
      <strong>Author:</strong> {{ props.commit.commit.author.name }}<br />
      <strong>Date:</strong> {{ formatDate(props.commit.commit.author.date) }}<br />
      <strong>Message:</strong> {{ props.commit.commit.message }}<br />
      <template v-if="props.details === undefined">
        <div class="mt-4 flex items-center gap-2 text-gray-400">
          <ArrowPathIcon class="animate-spin h-4 w-4 mr-2 text-blue-400" />
          Loading commit details…
        </div>
      </template>
      <template v-else>
        <div class="mt-2">
          <strong>Stats:</strong>
          <span v-if="props.details.stats">
            +{{ props.details.stats.additions }} / -{{ props.details.stats.deletions }} ({{
              props.details.stats.total
            }}
            changes)
          </span>
        </div>
        <div v-if="props.details.files && props.details.files.length" class="mt-2">
          <strong>Files Changed:</strong>
          <ul class="ml-4 list-disc">
            <li v-for="file in props.details.files" :key="file.filename">
              <span class="text-gray-300">{{ file.filename }}</span>
              <span v-if="file.additions || file.deletions" class="ml-2">
                <span class="text-green-400">+{{ file.additions }}</span>
                <span class="text-red-400 ml-1">-{{ file.deletions }}</span>
              </span>
            </li>
          </ul>
        </div>
        <div v-else class="mt-2 text-gray-400 italic">No file changes in this commit.</div>
      </template>
    </div>
  </div>
</template>
