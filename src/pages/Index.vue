<template>
  <!-- 主窗口 -->
  <div class="bg-background w-screen h-screen">
    <HomeHeader />
    <div
      class="w-full max-w-7xl mx-auto px-4 transition-all duration-300 h-[calc(100vh-64px)] overflow-auto">
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

const login = () => {
  userApi
    .login({
      account: userStore.account,
      password: userStore.password,
    })
    .then((res) => {
      if (res.data.code === 200) {
        userStore.token = res.data.data.token
        userStore.userInfo = res.data.data.userInfo
      }
    })
    .catch((error) => {
      userStore.userInfo = {} as UserType
      userStore.token = ''
    })
}

onMounted(() => {
  if (userStore.token) {
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
        if (userStore.account && userStore.password) {
          login()
        }
      })
  } else if (userStore.account && userStore.password) {
    login()
  }
})
</script>
