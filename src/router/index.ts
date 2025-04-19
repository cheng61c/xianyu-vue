import { createRouter, createWebHistory } from 'vue-router'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Index.vue'), // 懒加载组件
  },
]

// 创建路由实例
const router = createRouter({
  // history: createWebHashHistory(), // hash模式 有#号
  history: createWebHistory(), // history模式 无#号
  routes,
})

export default router
