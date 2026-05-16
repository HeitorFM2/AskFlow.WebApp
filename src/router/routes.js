const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'feed' } },
      {
        path: 'feed',
        name: 'feed',
        component: () => import('pages/FeedPage.vue'),
      },
      {
        path: 'liked',
        name: 'liked',
        component: () => import('pages/LikedPage.vue'),
      },
      {
        path: 'my-posts',
        name: 'my-posts',
        component: () => import('pages/MyPostsPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
