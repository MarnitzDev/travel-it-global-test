<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const username = computed(() => route.params.username as string);

</script>

<template>
    <div class="repo-view">
        <h1>Repositories for {{ username }}</h1>
        
        <section class="repos">
            <h2>Repositories</h2>
        </section>
    </div>
</template>