<template>
  <header class="flex h-16 w-full justify-between items-center bg-">
    <button class="flex justify-center items-center gap-2">
      <Logo
        class="text-base-content dark:color-gray-200"
        :style="{
          fill: themeStore.darkTheme ? 'gray' : 'inherit',
        }"
      />
      <div class="text-md text-base-content">{{ $t('logo') }}</div>
    </button>

    <HomeNav />

    <div class="flex"><ThemeButton /></div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/configStore'
import { Logo } from '@/icon.js'
import ThemeButton from '@/components/homeHeader/ThemeButton.vue'
import HomeNav from '@/components/homeHeader/HomeNav.vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const configStore = useConfigStore()
const { locale } = useI18n()

locale.value = configStore.lang // 设置初始语言
</script>
