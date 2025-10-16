<script setup lang="ts"></script>

<template>
  <header>
    <div class="header-content">
      <nav>
        <router-link to="/">TravelITGlobal Test</router-link>
      </nav>
    </div>
  </header>
  <main>
    <div class="container">
      <router-view />
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  color: #2c3e50;
}
header {
  background: #333; 
  padding: 1em; 
  text-align: center; 
}
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
