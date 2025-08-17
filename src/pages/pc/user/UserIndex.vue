<template>
  <div class="flex flex-col w-full items-center gap-4 py-2">
    <div v-if="isCurrentUser" class="flex gap-2 justify-center items-center">
      <ScButton
        v-for="btn in routeBtns"
        :key="btn.name"
        class="shadow-md px-4"
        :activation="activation === btn.name"
        @click="toPage(btn)">
        {{ btn.name }}
      </ScButton>
    </div>

    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'

import ScButton from '@/components/common/ScButton.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/module/user/userStore'

const { t } = useI18n()
const userStore = useUserStore()
const isCurrentUser = computed(() => {
  const userId = route.query.userId
  return Number(userId) !== userStore.userInfo.id
})

const route = useRoute()
const router = useRouter()
const routeBtns = ref([
  {
    name: t('nav.zhu-ye'),
    path: '/user/panel',
  },
  {
    name: t('nav.tie-zi'),
    path: '/user/post',
  },
  {
    name: t('nav.ping-lun'),
    path: '/user/comment',
  },
  {
    name: t('nav.zi-yuan'),
    path: '/user/resource',
  },
  {
    name: t('nav.wen-jian'),
    path: '/user/file',
  },
  {
    name: t('nav.fu-wu-qi'),
    path: '/user/server',
  },
  {
    name: t('nav.bian-ji-zi-liao'),
    path: '/user/edit',
  },
])
const activation = ref(t('nav.zhu-ye'))

const toPage = (btn: any) => {
  if (btn.path === route.path) return
  activation.value = btn.name
  router.push(btn.path)
}

onMounted(() => {
  const currentBtn = routeBtns.value.find((btn) => btn.path === route.path)
  if (currentBtn) {
    activation.value = currentBtn.name
  }
})

watch(
  () => route.path,
  (newPath) => {
    const currentBtn = routeBtns.value.find((btn) => btn.path === newPath)
    if (currentBtn) {
      activation.value = currentBtn.name
    }
  }
)
</script>
