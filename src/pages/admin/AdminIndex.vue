<template>
  <div class="flex w-full gap-4">
    <ScMenu :items="menuItems" v-model:activation="activation" />

    <div class="w-full"><RouterView></RouterView></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  CornerDownRight,
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  MessageSquare,
  Server,
  Flame,
  PackagePlus,
  Trash2,
  Minimize2,
  Eye,
  SquarePen,
  Delete,
  Download,
  SquareArrowOutUpRight,
} from 'lucide-vue-next'

import ScButton from '@/components/ScButton.vue'
import ScMenu from '@/components/admin/ScMenu.vue'

const route = useRoute()
const router = useRouter()
const activation = ref('')

const menuItems = [
  { icon: ThumbsUp, name: '首页', path: '/admin/panel' },
  { icon: ThumbsDown, name: '账号管理', path: '/admin/account' },
  { icon: CornerDownRight, name: '帖子管理', path: '/admin/post' },
  { icon: ArrowDownFromLine, name: '资源管理', path: '/admin/resource' },
  { icon: Server, name: '服务器管理', path: '/admin/server' },
  { icon: Server, name: '角色管理', path: '/admin/role' },
  { icon: Server, name: '板块管理', path: '/admin/plate' },
  { icon: Server, name: '游戏版本号', path: '/admin/version' },
  { icon: Server, name: '游戏公告', path: '/admin/motd' },
  { icon: Server, name: '后台日志', path: '/admin/info' },
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
