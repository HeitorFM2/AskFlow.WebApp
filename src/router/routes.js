const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
    meta: { guest: true },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("pages/ForgotPasswordPage.vue"),
    meta: { guest: true },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("pages/ResetPasswordPage.vue"),
    meta: { guest: true },
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: { name: "feed" } },
      {
        path: "feed",
        name: "feed",
        component: () => import("pages/FeedPage.vue"),
      },
      {
        path: "following-feed",
        name: "following-feed",
        component: () => import("pages/FollowingFeedPage.vue"),
      },
      {
        path: "liked",
        name: "liked",
        component: () => import("pages/LikedPage.vue"),
      },
      {
        path: "my-posts",
        name: "my-posts",
        component: () => import("pages/MyPostsPage.vue"),
      },
      {
        path: "users/:userName",
        name: "user-posts",
        component: () => import("pages/UserPostsPage.vue"),
      },
      {
        path: "followers",
        name: "followers",
        component: () => import("pages/FollowListPage.vue"),
      },
      {
        path: "following",
        name: "following",
        component: () => import("pages/FollowListPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
