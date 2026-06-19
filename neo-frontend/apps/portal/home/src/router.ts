import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home/',
  },
  {
    path: '/home/',
    name: 'Home',
    component: () => import('./Home.vue'),
  },
  {
    path: '/introduction/',
    name: 'Introduction',
    component: async () => {
      await import('../../introduction/src/style.css');
      return import('../../introduction/src/Introduction.vue');
    },
  },
  {
    path: '/privacy/',
    name: 'Privacy',
    component: async () => {
      await import('../../privacy/src/style.css');
      return import('../../privacy/src/Privacy.vue');
    },
  },
  // Catch-all 404 handler
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/home/',
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
