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
    <h1 class="text-2xl font-bold">
      {{ $t('d.mei-you-quan-xian-fang-wen-ci-ye-mian') }}
    </h1>
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
import { verifyPermissions } from '@/utils/verify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const activation = ref('')
const release = ref(true)

const menuItems = [
  {
    icon: Home,
    name: t('b.shou-ye'),
    path: '/admin/panel',
    role: verifyPermissions([1, 2, 3, 4, 5, 6, 7, 9, 10]),
  },
  {
    icon: UserRoundPen,
    name: t('b.zhang-hao-guan-li'),
    path: '/admin/account',
    role: verifyPermissions([1, 2, 3]),
  },
  {
    icon: UserRoundPlus,
    name: t('b.zhu-ce'),
    path: '/admin/reg',
    role: verifyPermissions([1]),
  },
  {
    icon: FileChartColumn,
    name: t('b.tie-zi-guan-li'),
    path: '/admin/post',
    role: verifyPermissions([1, 2, 9]),
  },
  {
    icon: ShieldAlert,
    name: t('b.ju-bao-shen-he'),
    path: '/admin/report',
    role: verifyPermissions([1, 2, 7]),
  },
  {
    icon: Package,
    name: t('b.zi-yuan-guan-li'),
    path: '/admin/resource',
    role: verifyPermissions([1, 2, 5]),
  },
  {
    icon: Server,
    name: t('b.fu-wu-qi-guan-li'),
    path: '/admin/server',
    role: verifyPermissions([1, 2, 4]),
  },
  {
    icon: Award,
    name: t('b.jiao-se-guan-li'),
    path: '/admin/role',
    role: verifyPermissions([1, 2]),
  },
  {
    icon: LayoutPanelTop,
    name: t('b.ban-kuai-guan-li'),
    path: '/admin/plate',
    role: verifyPermissions([1, 2, 5, 9]),
  },
  {
    icon: GitCommitHorizontal,
    name: t('b.you-xi-ban-ben-hao'),
    path: '/admin/version',
    role: verifyPermissions([1, 2, 3, 10]),
  },
  {
    icon: Megaphone,
    name: t('b.you-xi-gong-gao'),
    path: '/admin/motd',
    role: verifyPermissions([1, 2, 6]),
  },
  {
    icon: Info,
    name: t('b.hou-tai-ri-zhi'),
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
