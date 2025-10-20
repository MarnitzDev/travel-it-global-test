<template>
  <header class="app-header  border-b border-gray-700 bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="text-2xl font-bold text-white">
          Travel<span class="text-green-500">it</span>Global <span class="font-normal"> Assignment</span>
        </router-link>
      </div>
      <div>
        <router-link to="/favorites" class="btn-primary ml-4">Favorites</router-link>
      </div>
    </div>
    </div>
  </header>
</template>