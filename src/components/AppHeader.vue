<template>
  <header class="app-header border-b border-gray-700 bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-2">
        <div class="flex items-center justify-between sm:justify-start space-x-4">
          <router-link to="/" class="text-2xl font-bold text-white text-center sm:text-left w-full">
            Travel<span class="text-green-500">it</span>Global <span class="font-normal"> Assignment</span>
          </router-link>
        </div>
        <div class="flex items-center space-x-2 justify-center sm:justify-end">
          <router-link to="/repos" class="btn-primary">Repos</router-link>
          <router-link to="/favorites" class="btn-primary ml-2">Favorites</router-link>
        </div>
      </div>
    </div>
  </header>
</template>