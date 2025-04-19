<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100"
  >
    <div
      class="bg-base-100 dark:bg-base-200 rounded-lg px-6 py-8 ring shadow-lg dark:shadow-gray-300/5 ring-gray-900/5 dark:ring-gray-300/5"
    >
      <h3 class="text-base-content font-medium tracking-tight">
        {{ $t('title') }}
      </h3>
      <p class="text-base-content mt-2 text-sm">
        tailwindcss: {{ $t('description') }}
      </p>
      <el-text> el-text: {{ $t('description') }} </el-text>
    </div>

    <div class="mt-6 flex flex-wrap gap-4 justify-center">
      <button
        @click="toggleTheme"
        class="px-4 py-2 bg-gray-200 dark:bg-gray-500 rounded"
      >
        {{ $t('button') }}
      </button>
      <select
        :value="configStore.lang"
        @change="changeLocale"
        class="px-3 py-2 rounded bg-gray-200 dark:bg-gray-500"
      >
        <option value="zh">简体中文</option>
        <option value="en">English</option>
      </select>
      <button class="btn btn-ml">1111</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/configStore'
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
