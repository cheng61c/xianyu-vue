<template>
  <!-- 主窗口 -->
  <div class="bg-background w-screen h-screen overflow-auto">
    <HomeHeader />
    <div class="w-full max-w-7xl mx-auto px-4 transition-all duration-300">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/homeHeader/HomeHeader.vue'

import { userApi } from '@/apis'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

import { onMounted } from 'vue'
import type { UserType } from '@/types'

onMounted(() => {
  userApi
    .getCurrentUser()
    .then((res) => {
      if (res.data.code === 200) {
        userStore.userInfo = res.data.data
      }
    })
    .catch((error) => {
      userStore.userInfo = {} as UserType
      userStore.token = ''
      console.log(error)
    })
})
</script>
