const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/chat',
    component: () => import('@/pages/chat.vue'),
  },
  {
    path: '/signup',
    component: () => import('@/pages/signup.vue'),
  },
  {
    path: '/login',
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/home',
    component: () => import('@/pages/home.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/notFound.vue'),
  },
];

export default routes;
