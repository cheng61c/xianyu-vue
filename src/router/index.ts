import { createRouter, createWebHashHistory } from 'vue-router'

const isMobile =
  /(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(
    navigator.userAgent.toLowerCase()
  )

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/postList/0',
    component: () => import('@/pages/Index.vue'),
    children: [
      {
        path: 'postList/:plateId?',
        name: 'postList',
        component: () => {
          return isMobile
            ? import('@/pages/mobile/post/MobilePostIndex.vue')
            : import('@/pages/pc/post/PostIndex.vue')
        },
      },
      {
        path: 'modList/:plateId?',
        name: 'modList',
        component: () => {
          return isMobile
            ? import('@/pages/mobile/post/MobilePostIndex.vue')
            : import('@/pages/pc/post/PostIndex.vue')
        },
      },
      {
        path: 'postDetails/:postId',
        name: 'postDetails',
        component: () => {
          return isMobile
            ? import('@/pages/mobile/post/MobilePostDetails.vue')
            : import('@/pages/pc/post/PostDetails.vue')
        },
      },
      {
        path: 'publish/:postId?',
        name: 'publish',
        component: () => {
          return isMobile
            ? import('@/pages/mobile/publish/MobilePublishIndex.vue')
            : import('@/pages/pc/publish/PublishIndex.vue')
        },
      },
      {
        path: 'publishResource/:postId?',
        name: 'publishResource',
        component: () => {
          return isMobile
            ? import('@/pages/mobile/publish/MobilePublishIndex.vue')
            : import('@/pages/pc/publish/PublishIndex.vue')
        },
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/pages/pc/message/MessageIndex.vue'),
      },
      {
        path: 'fengyunbang',
        name: 'fengyunbang',
        component: () => import('@/pages/pc/fengyunbang/FengYunBangIndex.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        redirect: '/admin/panel',
        component: () => import('@/pages/pc/admin/AdminIndex.vue'),
        children: [
          {
            path: 'panel',
            name: 'adminPanel',
            component: () => import('@/pages/pc/admin/children/AdminPanel.vue'),
          },
          {
            path: 'account',
            name: 'adminAccount',
            component: () =>
              import('@/pages/pc/admin/children/AdminAccount.vue'),
          },
          {
            path: 'post',
            name: 'adminPost',
            component: () => import('@/pages/pc/admin/children/AdminPost.vue'),
          },
          {
            path: 'report',
            name: 'adminReport',
            component: () =>
              import('@/pages/pc/admin/children/AdminReport.vue'),
          },
          {
            path: 'resource',
            name: 'adminResource',
            component: () =>
              import('@/pages/pc/admin/children/AdminResource.vue'),
          },
          {
            path: 'server',
            name: 'adminServer',
            component: () =>
              import('@/pages/pc/admin/children/AdminServer.vue'),
          },
          {
            path: 'role',
            name: 'adminRole',
            component: () => import('@/pages/pc/admin/children/AdminRole.vue'),
          },
          {
            path: 'plate',
            name: 'adminPlate',
            component: () => import('@/pages/pc/admin/children/AdminPlate.vue'),
          },
          {
            path: 'version',
            name: 'adminVersion',
            component: () =>
              import('@/pages/pc/admin/children/AdminVersion.vue'),
          },
          {
            path: 'motd',
            name: 'adminMotd',
            component: () => import('@/pages/pc/admin/children/AdminMotd.vue'),
          },
          {
            path: 'info',
            name: 'adminInfo',
            component: () => import('@/pages/pc/admin/children/AdminInfo.vue'),
          },
          {
            path: 'reg',
            name: 'adminRegistered',
            component: () =>
              import('@/pages/pc/admin/children/AdminRegistered.vue'),
          },
          {
            path: 'fengyunbang',
            name: 'adminFengYunBang',
            component: () =>
              import('@/pages/pc/admin/children/AdminFengYunBang.vue'),
          },
        ],
      },
      {
        path: 'user',
        name: 'user',
        redirect: '/user/panel',
        component: () => import('@/pages/pc/user/UserIndex.vue'),
        children: [
          {
            path: 'panel',
            name: 'userPanel',
            component: () => import('@/pages/pc/user/children/UserPanel.vue'),
          },
          {
            path: 'post',
            name: 'userPost',
            component: () => import('@/pages/pc/user/children/UserPost.vue'),
          },
          {
            path: 'resource',
            name: 'userResource',
            component: () =>
              import('@/pages/pc/user/children/UserResource.vue'),
          },
          {
            path: 'file',
            name: 'userFile',
            component: () => import('@/pages/pc/user/children/UserFile.vue'),
          },
          {
            path: 'server',
            name: 'userServer',
            component: () => import('@/pages/pc/user/children/UserServer.vue'),
          },
          {
            path: 'comment',
            name: 'userComment',
            component: () => import('@/pages/pc/user/children/UserComment.vue'),
          },
          {
            path: 'edit',
            name: 'userEdit',
            component: () => import('@/pages/pc/user/children/UserEdit.vue'),
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
