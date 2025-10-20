<script setup lang="ts">
 import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <AppHeader />
  <main class="bg-gray-900">
    <div class="container">
      <router-view />
    </div>
  </main>
</template>
  
<style lang="scss">

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2em;
}
h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}
nav {
  display: flex;
  align-items: center;
  justify-content: center;
}
nav a {
  color: #ffffff;
  text-decoration: none;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em 1em;
  min-height: 80vh;
}
</style>
