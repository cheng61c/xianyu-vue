import { createRouter, createWebHashHistory } from 'vue-router'

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
            component: () => import('@/pages/admin/children/AdminAccount.vue'),
          },
          {
            path: 'post',
            name: 'adminPost',
            component: () => import('@/pages/admin/children/AdminPost.vue'),
          },
          {
            path: 'report',
            name: 'adminReport',
            component: () => import('@/pages/admin/children/AdminReport.vue'),
          },
          {
            path: 'resource',
            name: 'adminResource',
            component: () => import('@/pages/admin/children/AdminResource.vue'),
          },
          {
            path: 'server',
            name: 'adminServer',
            component: () => import('@/pages/admin/children/AdminServer.vue'),
          },
          {
            path: 'role',
            name: 'adminRole',
            component: () => import('@/pages/admin/children/AdminRole.vue'),
          },
          {
            path: 'plate',
            name: 'adminPlate',
            component: () => import('@/pages/admin/children/AdminPlate.vue'),
          },
          {
            path: 'version',
            name: 'adminVersion',
            component: () => import('@/pages/admin/children/AdminVersion.vue'),
          },
          {
            path: 'motd',
            name: 'adminMotd',
            component: () => import('@/pages/admin/children/AdminMotd.vue'),
          },
          {
            path: 'info',
            name: 'adminInfo',
            component: () => import('@/pages/admin/children/AdminInfo.vue'),
          },
          {
            path: 'reg',
            name: 'adminRegistered',
            component: () =>
              import('@/pages/admin/children/AdminRegistered.vue'),
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
          {
            path: 'edit',
            name: 'userEdit',
            component: () => import('@/pages/user/children/UserEdit.vue'),
          },
        ],
      },
    ],
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // hash模式 有#号
  // history: createWebHistory(), // history模式 无#号
  routes,
})

router.beforeEach((to, _from, next) => {
  console.log('Navigating to:', to.name)
  next()
})

export default router
