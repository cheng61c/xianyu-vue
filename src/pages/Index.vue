<template>
  <PcIndex v-if="deviceStore.device == 2" />
  <MobileIndex v-else />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/module/user/userStore'
import { onMounted, watch } from 'vue'
import PcIndex from './pc/PcIndex.vue'
import MobileIndex from './mobile/MobileIndex.vue'
import { useDeviceStore } from '@/stores/global/deviceStore'
import { getInfo, login } from '@/stores/module/user/service'
import { getMessages } from '@/stores/module/message/service'
import { useThemeStore } from '@/stores/global/themeStore'
import { applyTheme } from '@/utils/color'

const userStore = useUserStore()
const deviceStore = useDeviceStore()

onMounted(async () => {
  if (userStore.autoLogin) {
    await login()
  } else {
    getInfo()
  }
  getMessages()
})

const themeStore = useThemeStore()
watch(
  () => themeStore.darkTheme,
  (newTheme) => {
    applyTheme(newTheme)
  },
  { immediate: true }
)
</script>
