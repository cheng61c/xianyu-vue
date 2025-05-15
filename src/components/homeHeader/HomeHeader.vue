<template>
  <header
    class="sticky top-0 w-full max-w-7xl mx-auto px-4 flex h-16 justify-between items-center bg-background z-10">
    <button
      class="flex justify-center items-center gap-2 cursor-pointer"
      @click="$router.push('/')">
      <Logo
        class="text-background-content"
        :style="{
          fill: themeStore.darkTheme ? 'rgba(255, 255, 255, 0.9)' : '#666666',
        }" />
      <div class="text-md text-background-content font-bold">
        {{ $t('logo') }}
      </div>
    </button>

    <HomeNav />

    <div class="flex gap-4 items-center"><ScLogin /><ThemeButton /></div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/configStore'
import { Logo } from '@/icon.js'
import ThemeButton from './ThemeButton.vue'
import HomeNav from './HomeNav.vue'
import ScLogin from './ScLogin.vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const configStore = useConfigStore()
const { locale } = useI18n()

locale.value = configStore.lang // 设置初始语言
</script>
