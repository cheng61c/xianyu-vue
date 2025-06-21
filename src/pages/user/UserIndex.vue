<template>
  <div class="flex flex-col w-full items-center gap-4 py-2">
    <div class="flex gap-2 justify-center items-center">
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
import { onMounted, ref, watch } from 'vue'

import ScButton from '@/components/ScButton.vue'

const route = useRoute()
const router = useRouter()
const routeBtns = ref([
  {
    name: '主页',
    path: '/user/panel',
  },
  {
    name: '帖子',
    path: '/user/post',
  },
  {
    name: '评论',
    path: '/user/comment',
  },
  {
    name: '资源',
    path: '/user/resource',
  },
  {
    name: '文件',
    path: '/user/file',
  },
  {
    name: '服务器',
    path: '/user/server',
  },
  {
    name: '编辑资料',
    path: '/user/edit',
  },
])
const activation = ref('主页')

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
