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
      {
        path: 'postDetails/:postId',
        name: 'postDetails',
        component: () => import('@/pages/post/PostDetails.vue'),
      },
      {
        path: 'publish/:postId?',
        name: 'publish',
        component: () => import('@/pages/publish/PublishIndex.vue'),
      },
      {
        path: 'publishResource/:postId?',
        name: 'publishResource',
        component: () => import('@/pages/publish/PublishIndex.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        redirect: '/admin/panel',
        component: () => import('@/pages/admin/AdminIndex.vue'),
        children: [
          {
            path: 'panel',
            name: 'adminPanel',
            component: () => import('@/pages/admin/children/AdminPanel.vue'),
          },
          {
            path: 'account',
            name: 'adminAccount',
            component: () => import('@/pages/admin/children/AdminPanel.vue'),
          },
          {
            path: 'post',
            name: 'adminPost',
            component: () => import('@/pages/admin/children/AdminPost.vue'),
          },
        ],
      },
      {
        path: 'user',
        name: 'user',
        redirect: '/user/panel',
        component: () => import('@/pages/user/UserIndex.vue'),
        children: [
          {
            path: 'panel',
            name: 'userPanel',
            component: () => import('@/pages/user/children/UserPanel.vue'),
          },
          {
            path: 'post',
            name: 'userPost',
            component: () => import('@/pages/user/children/UserPost.vue'),
          },
          {
            path: 'resource',
            name: 'userResource',
            component: () => import('@/pages/user/children/UserResource.vue'),
          },
          {
            path: 'file',
            name: 'userFile',
            component: () => import('@/pages/user/children/UserFile.vue'),
          },
          {
            path: 'server',
            name: 'userServer',
            component: () => import('@/pages/user/children/UserServer.vue'),
          },
          {
            path: 'comment',
            name: 'userComment',
            component: () => import('@/pages/user/children/UserComment.vue'),
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

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.name)
  next()
})

export default router
