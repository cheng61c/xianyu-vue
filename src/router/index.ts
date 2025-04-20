import { createRouter, createWebHistory } from 'vue-router'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/postlist/0',
    component: () => import('@/pages/Index.vue'),
    children: [
      {
        path: 'postlist/:plateId?',
        name: 'postList',
        component: () => import('@/pages/post/PostIndex.vue'),
      },
      {
        path: 'modList/:plateId?',
        name: 'modList',
        component: () => import('@/pages/post/PostIndex.vue'),
      },
    ],
  },
]

// 创建路由实例
const router = createRouter({
  // history: createWebHashHistory(), // hash模式 有#号
  history: createWebHistory(), // history模式 无#号
  routes,
})

export default router
