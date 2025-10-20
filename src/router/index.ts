import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';

import ReposView from '../views/ReposView.vue';
import CommitsView from '../views/CommitsView.vue';
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
      path: '/repos',
      name: 'repos',
      component: ReposView,
    },
    {
      path: '/repos/:username/:repo',
      name: 'commits',
      component: CommitsView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
  ],
})

export default router
