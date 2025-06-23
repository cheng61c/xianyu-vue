<template>
  <PcIndex />
  <MobileIndex v-if="false" />
</template>

<script setup lang="ts">
import { userApi } from '@/apis'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

import { onMounted } from 'vue'
import type { UserType } from '@/types'
import PcIndex from './pc/PcIndex.vue'
import MobileIndex from './mobile/MobileIndex.vue'

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
        userStore.userInfo = res.data.data
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
