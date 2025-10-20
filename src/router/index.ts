import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';

import RepoView from '../views/RepoView.vue';
import FavoritesView from '../views/FavoritesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/repos/:username',
      name: 'repos',
      component: RepoView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
  ],
})

export default router
