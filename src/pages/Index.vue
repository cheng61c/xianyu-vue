<template>
  <header class="flex h-16 justify-baseline items-center px-6">
    <div class="flex justify-center items-center gap-2">
      <Logo class="text-base-content" />
      <div class="text-lg text-base-content font-bold">SC 社区</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/configStore'
import { Logo } from '@/icon.js'
import { ref } from 'vue'

const configStore = useConfigStore()
const { locale } = useI18n()
const time = ref<Date>()

locale.value = configStore.lang // 设置初始语言

// UI 语言切换
const changeLocale = (e: Event) => {
  const target = e.target as HTMLSelectElement
  configStore.lang = target.value
  locale.value = target.value
}

// 切换暗黑模式
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  document.documentElement.classList.toggle('dark')
}
</script>
