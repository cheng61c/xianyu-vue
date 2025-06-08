<template>
  <!-- 主窗口 -->
  <div class="h-screen mx-auto max-w-[1600px]">
    <HomeHeader />
    <div class="w-full mx-auto px-4 h-[calc(100vh-64px)] overflow-y-auto">
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
    .catch((_error) => {
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
      .catch((_error) => {
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
