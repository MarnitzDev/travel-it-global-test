<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <div class="bg-gray-900 min-h-screen text-white flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <div class="container">
        <router-view />
      </div>
    </main>
    <AppFooter class="mt-16" />
  </div>
</template>
  
<style lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em 1em;
}
</style>
