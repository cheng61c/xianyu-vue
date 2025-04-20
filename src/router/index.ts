import { createRouter, createWebHistory } from 'vue-router'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/postlist/0', // 访问根路径时跳转到 /a
    component: () => import('@/pages/Index.vue'), // 懒加载组件
    children: [
      {
        path: 'postlist/:plateId?',
        name: 'PostList',
        component: () => import('@/pages/post/PostIndex.vue'),
        children: [
          {
            path: ':plateId',
            name: 'PostPlate',
            component: () => import('@/pages/post/PostPlate.vue'),
          },
        ],
      },
      {
        path: 'modList/:plateId?',
        name: 'modList',
        component: () => import('@/pages/post/PostIndex.vue'),
        children: [
          {
            path: ':plateId',
            name: 'PostPlate',
            component: () => import('@/pages/post/PostPlate.vue'),
          },
        ],
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
