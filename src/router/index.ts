import { createRouter, createWebHashHistory } from 'vue-router'

// 检测设备是否为移动端
const isMobile = /(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(
  navigator.userAgent.toLowerCase()
)

// 定义路由配置（你的原有路由逻辑不变）
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/modList/0',
    component: () => import('@/pages/Index.vue'),
    children: [
      // 所有子路由保持你原来的写法，无需修改
      { path: 'test', name: 'test', component: () => import('@/pages/test/TestPage.vue') },
      {
        path: 'postList/:plateId?',
        name: 'postList',
        component: () => (isMobile ? import('@/pages/mobile/post/MobilePostIndex.vue') : import('@/pages/pc/post/PostIndex.vue'))
      },
      {
        path: 'modList/:plateId?',
        name: 'modList',
        component: () => (isMobile ? import('@/pages/mobile/post/MobilePostIndex.vue') : import('@/pages/pc/post/PostIndex.vue'))
      },
      {
        path: 'postDetails/:postId',
        name: 'postDetails',
        component: () => (isMobile ? import('@/pages/mobile/post/MobilePostDetails.vue') : import('@/pages/pc/post/PostDetails.vue'))
      },
      {
        path: 'publish',
        name: 'publish',
        component: () => (isMobile ? import('@/pages/mobile/publish/MobilePublishIndex.vue') : import('@/pages/pc/publish/PublishIndex.vue')),
        children: [
          {
            path: 'post/:postId?',
            name: 'publishPost',
            component: () => (isMobile ? import('@/pages/mobile/publish/MobileCreatePost.vue') : import('@/pages/pc/publish/CreatePost.vue'))
          },
          {
            path: 'resource/:postId?',
            name: 'publishResource',
            component: () => (isMobile ? import('@/pages/mobile/publish/MobileCreateResource.vue') : import('@/pages/pc/publish/CreateResource.vue'))
          }
        ]
      },
      {
        path: 'message',
        name: 'message',
        component: () => (isMobile ? import('@/pages/mobile/message/MobileMessageIndex.vue') : import('@/pages/pc/message/MessageIndex.vue'))
      },
      {
        path: 'mingrentang',
        name: 'mingrentang',
        component: () => (isMobile ? import('@/pages/mobile/fengyunbang/MobileFengYunBangIndex.vue') : import('@/pages/pc/fengyunbang/FengYunBangIndex.vue'))
      },
      // 管理员路由（PC+移动端）
      {
        path: 'admin',
        name: 'admin',
        redirect: '/admin/panel',
        component: () => import('@/pages/pc/admin/AdminIndex.vue'),
        children: [
          { path: 'panel', name: 'adminPanel', component: () => import('@/pages/pc/admin/children/AdminPanel.vue') },
          { path: 'account', name: 'adminAccount', component: () => import('@/pages/pc/admin/children/AdminAccount.vue') },
          { path: 'post', name: 'adminPost', component: () => import('@/pages/pc/admin/children/AdminPost.vue') },
          { path: 'report', name: 'adminReport', component: () => import('@/pages/pc/admin/children/AdminReport.vue') },
          { path: 'resource', name: 'adminResource', component: () => import('@/pages/pc/admin/children/AdminResource.vue') },
          { path: 'server', name: 'adminServer', component: () => import('@/pages/pc/admin/children/AdminServer.vue') },
          { path: 'role', name: 'adminRole', component: () => import('@/pages/pc/admin/children/AdminRole.vue') },
          { path: 'plate', name: 'adminPlate', component: () => import('@/pages/pc/admin/children/AdminPlate.vue') },
          { path: 'version', name: 'adminVersion', component: () => import('@/pages/pc/admin/children/AdminVersion.vue') },
          { path: 'motd', name: 'adminMotd', component: () => import('@/pages/pc/admin/children/AdminMotd.vue') },
          { path: 'info', name: 'adminInfo', component: () => import('@/pages/pc/admin/children/AdminInfo.vue') },
          { path: 'reg', name: 'adminRegistered', component: () => import('@/pages/pc/admin/children/AdminRegistered.vue') },
          { path: 'mingrentang', name: 'adminFengYunBang', component: () => import('@/pages/pc/admin/children/AdminFengYunBang.vue') }
        ]
      },
      {
        path: 'mobile/admin',
        name: 'mobileAdmin',
        redirect: '/mobile/admin/panel',
        component: () => import('@/pages/mobile/admin/MobileAdminIndex.vue'),
        children: [
          { path: 'panel', name: 'mobileAdminPanel', component: () => import('@/pages/mobile/admin/children/MobileAdminPanel.vue') },
          { path: 'account', name: 'mobileAdminAccount', component: () => import('@/pages/mobile/admin/children/MobileAdminAccount.vue') },
          { path: 'post', name: 'mobileAdminPost', component: () => import('@/pages/mobile/admin/children/MobileAdminPost.vue') },
          { path: 'report', name: 'mobileAdminReport', component: () => import('@/pages/mobile/admin/children/MobileAdminReport.vue') },
          { path: 'resource', name: 'mobileAdminResource', component: () => import('@/pages/mobile/admin/children/MobileAdminResource.vue') },
          { path: 'server', name: 'mobileAdminServer', component: () => import('@/pages/mobile/admin/children/MobileAdminServer.vue') },
          { path: 'role', name: 'mobileAdminRole', component: () => import('@/pages/mobile/admin/children/MobileAdminRole.vue') },
          { path: 'plate', name: 'mobileAdminPlate', component: () => import('@/pages/mobile/admin/children/MobileAdminPlate.vue') },
          { path: 'version', name: 'mobileAdminVersion', component: () => import('@/pages/mobile/admin/children/MobileAdminVersion.vue') },
          { path: 'motd', name: 'mobileAdminMotd', component: () => import('@/pages/mobile/admin/children/MobileAdminMotd.vue') },
          { path: 'info', name: 'mobileAdminInfo', component: () => import('@/pages/mobile/admin/children/MobileAdminInfo.vue') },
          { path: 'reg', name: 'mobileAdminRegistered', component: () => import('@/pages/mobile/admin/children/MobileAdminRegistered.vue') },
          { path: 'mingrentang', name: 'mobileAdminFengYunBang', component: () => import('@/pages/mobile/admin/children/MobileAdminFengYunBang.vue') }
        ]
      },
      // 用户路由（PC+移动端）
      {
        path: 'user',
        name: 'user',
        redirect: isMobile ? '/mobile/user' : '/user/panel',
        component: () => import('@/pages/pc/user/UserIndex.vue'),
        children: [
          { path: 'panel', name: 'userPanel', component: () => import('@/pages/pc/user/children/UserPanel.vue') },
          { path: 'post', name: 'userPost', component: () => import('@/pages/pc/user/children/UserPost.vue') },
          { path: 'resource', name: 'userResource', component: () => import('@/pages/pc/user/children/UserResource.vue') },
          { path: 'file', name: 'userFile', component: () => import('@/pages/pc/user/children/UserFile.vue') },
          { path: 'server', name: 'userServer', component: () => import('@/pages/pc/user/children/UserServer.vue') },
          { path: 'comment', name: 'userComment', component: () => import('@/pages/pc/user/children/UserComment.vue') },
          { path: 'edit', name: 'userEdit', component: () => import('@/pages/pc/user/children/UserEdit.vue') }
        ]
      },
      {
        path: 'mobile/user',
        name: 'mobileUser',
        redirect: '/mobile/user/panel',
        component: () => import('@/pages/mobile/user/MobileUserIndex.vue'),
        children: [
          { path: 'panel', name: 'mobileUserPanel', component: () => import('@/pages/mobile/user/children/MobileUserPanel.vue') },
          { path: 'post', name: 'mobileUserPost', component: () => import('@/pages/mobile/user/children/MobileUserPost.vue') },
          { path: 'resource', name: 'mobileUserResource', component: () => import('@/pages/mobile/user/children/MobileUserResource.vue') },
          { path: 'file', name: 'mobileUserFile', component: () => import('@/pages/mobile/user/children/MobileUserFile.vue') },
          { path: 'server', name: 'mobileUserServer', component: () => import('@/pages/mobile/user/children/MobileUserServer.vue') },
          { path: 'comment', name: 'mobileUserComment', component: () => import('@/pages/mobile/user/children/MobileUserComment.vue') },
          { path: 'edit', name: 'mobileUserEdit', component: () => import('@/pages/mobile/user/children/MobileUserEdit.vue') },
          { path: 'account-security', name: 'mobileAccountSecurity', component: () => import('@/pages/mobile/user/children/MobileAccountSecurity.vue') }
        ]
      }
    ]
  }
]

// 核心：强制使用Hash模式（关键！避免GitHub Pages刷新404）
const router = createRouter({
  history: createWebHashHistory(), // 固定用Hash模式，注释掉history模式
  routes,
  // 可选：添加滚动行为，优化路由跳转体验
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫保持不变
router.beforeEach((to, _from, next) => {
  console.log('Navigating to:', to.name)
  next()
})

export default router