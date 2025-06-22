<template>
  <!-- 主窗口 -->
  <div class="h-screen mx-auto max-w-[1600px]">
    <HomeHeader />
    <div class="w-full mx-auto px-4 pt-1 h-[calc(100vh-68px)] overflow-y-auto">
      <router-view></router-view>
    </div>
    <PopUpAnnouncement />
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/homeHeader/HomeHeader.vue'

import { userApi } from '@/apis'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

import { onMounted } from 'vue'
import type { UserType } from '@/types'
import PopUpAnnouncement from '@/components/PopUpAnnouncement.vue'

const login = async () => {
  userApi
    .login({
      account: userStore.account,
      password: userStore.password,
    })
    .then((res) => {
      if (res.data.code === 200) {
        userStore.token = res.data.data.token
        userStore.userInfo = res.data.data.user
        userStore.isLogin = true
      }
    })
    .catch((_error) => {
      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

const getInfo = async () => {
  userApi
    .getCurrentUser()
    .then((res) => {
      if (res.data.code === 200) {
        userStore.userInfo = res.data.data.user
        userStore.isLogin = true
      }
    })
    .catch((_error) => {
      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

onMounted(async () => {
  if (userStore.autoLogin) {
    await login()
  } else {
    getInfo()
  }
})
</script>
