<template>
  <div
    v-if="verifyPermissions([1, 2, 3, 4, 5, 6, 7, 10])"
    class="flex w-full gap-4">
    <ScMenu :items="menuItems" v-model:activation="activation" />

    <div
      v-if="release"
      class="px-2 w-full h-[calc(100vh-74px)] pb-2 overflow-y-auto no-scrollbar">
      <RouterView></RouterView>
    </div>
  </div>
  <div
    v-else
    class="flex items-center justify-center h-[calc(100vh-64px)] w-full">
    <h1 class="text-2xl font-bold">没有权限访问此页面</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import {
  Package,
  Server,
  UserRoundPen,
  FileChartColumn,
  Award,
  LayoutPanelTop,
  GitCommitHorizontal,
  Megaphone,
  Info,
  Home,
  ShieldAlert,
  UserRoundPlus,
} from 'lucide-vue-next'

import ScMenu from '@/components/pc/admin/ScMenu.vue'
import { verifyPermissions } from '@/hook/verify'

const route = useRoute()
const activation = ref('')
const release = ref(true)

const menuItems = [
  {
    icon: Home,
    name: '首页',
    path: '/admin/panel',
    role: verifyPermissions([1, 2, 3, 4, 5, 6, 7, 9, 10]),
  },
  {
    icon: UserRoundPen,
    name: '账号管理',
    path: '/admin/account',
    role: verifyPermissions([1, 2, 3]),
  },
  {
    icon: UserRoundPlus,
    name: '注册',
    path: '/admin/reg',
    role: verifyPermissions([1]),
  },
  {
    icon: FileChartColumn,
    name: '帖子管理',
    path: '/admin/post',
    role: verifyPermissions([1, 2, 9]),
  },
  {
    icon: ShieldAlert,
    name: '举报审核',
    path: '/admin/report',
    role: verifyPermissions([1, 2, 7]),
  },
  {
    icon: Package,
    name: '资源管理',
    path: '/admin/resource',
    role: verifyPermissions([1, 2, 5]),
  },
  {
    icon: Server,
    name: '服务器管理',
    path: '/admin/server',
    role: verifyPermissions([1, 2, 4]),
  },
  {
    icon: Award,
    name: '角色管理',
    path: '/admin/role',
    role: verifyPermissions([1, 2]),
  },
  {
    icon: LayoutPanelTop,
    name: '板块管理',
    path: '/admin/plate',
    role: verifyPermissions([1, 2, 5, 9]),
  },
  {
    icon: GitCommitHorizontal,
    name: '游戏版本号',
    path: '/admin/version',
    role: verifyPermissions([1, 2, 3, 10]),
  },
  {
    icon: Megaphone,
    name: '游戏公告',
    path: '/admin/motd',
    role: verifyPermissions([1, 2, 6]),
  },
  {
    icon: Info,
    name: '后台日志',
    path: '/admin/info',
    role: verifyPermissions([1, 2]),
  },
]

onMounted(() => {
  const currentBtn = menuItems.find((btn) => btn.path === route.path)
  if (currentBtn) {
    activation.value = currentBtn.name
  }
})

watch(
  () => route.path,
  (newPath) => {
    const currentBtn = menuItems.find((btn) => btn.path === newPath)
    if (currentBtn) {
      activation.value = currentBtn.name
      if (!currentBtn.role) {
        release.value = false
      }
    }
  },
  { immediate: true, deep: true }
)
</script>
