<template>
  <PcIndex v-if="deviceStore.device == 2" @contextmenu="handleMouseMove" />
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
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/global/configStore'

const { t, locale } = useI18n()
const userStore = useUserStore()
const deviceStore = useDeviceStore()
const configStore = useConfigStore()
locale.value = configStore.lang.value // 设置初始语言

onMounted(async () => {
  if (userStore.autoLogin) {
    await login()
  } else {
    getInfo()
  }
  getMessages(t)
})

const themeStore = useThemeStore()
watch(
  () => themeStore.darkTheme,
  (newTheme) => {
    applyTheme(newTheme)
  },
  { immediate: true }
)

const handleMouseMove = (e: MouseEvent) => {
  configStore.menu.x = e.clientX
  configStore.menu.y = e.clientY
}
</script>
