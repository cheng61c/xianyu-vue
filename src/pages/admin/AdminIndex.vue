<template>
  <div class="flex w-full gap-4">
    <ScMenu :items="menuItems" v-model:activation="activation" />

    <div class="w-full"><RouterView></RouterView></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import {
  Package,
  Server,
  UserRound,
  FileChartColumn,
  Award,
  LayoutPanelTop,
  GitCommitHorizontal,
  Megaphone,
  Info,
  Home,
} from 'lucide-vue-next'

import ScMenu from '@/components/admin/ScMenu.vue'
import { verifyPermissions } from '@/hook/verify'

const route = useRoute()
const activation = ref('')

const menuItems = [
  {
    icon: Home,
    name: '首页',
    path: '/admin/panel',
    role: verifyPermissions([1, 2, 3, 4, 5, 6, 7, 9, 10]),
  },
  {
    icon: UserRound,
    name: '账号管理',
    path: '/admin/account',
    role: verifyPermissions([1, 2, 3]),
  },
  {
    icon: FileChartColumn,
    name: '帖子管理',
    path: '/admin/post',
    role: verifyPermissions([1, 2, 9]),
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
    }
  },
  { immediate: true, deep: true }
)
</script>
