<template>
  <!-- 悬浮球 -->
  <div
    v-if="!popupVisible"
    class="fixed bottom-4 right-4 w-14 h-14 flex bg-blue-500 rounded-full items-center justify-center cursor-pointer transition-all duration-300 ease-in-out z-50 no-select lg:w-20 lg:h-20"
    @click="toggleCard"
  >
    <span class="text-white text-xl no-select">⚽</span>
  </div>

  <!-- 弹窗卡片 -->
  <div
    v-if="popupVisible"
    class="fixed bottom-4 right-4 w-72 bg-base-100 dark:bg-base-300 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out z-50"
    :style="popupStyle"
  >
    <div class="flex justify-between items-center mb-4">
      <span class="font-semibold text-xl text-info no-select">{{
        $t('gong-ju-xiang')
      }}</span>
      <button
        @click="toggleCard"
        class="text-red-500 hover:text-red-700 focus:outline-none"
      >
        <Minimize2 />
      </button>
    </div>

    <div class="flex flex-col space-y-4">
      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('yu-yan-qie-huan') }}</div>
        <select
          :value="configStore.lang"
          @change="changeLocale"
          class="px-3 py-2 rounded bg-base-200"
        >
          <option value="zh">简体中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('zhou-ye-qie-huan') }}</div>
        <label class="toggle text-base-content">
          <input
            type="checkbox"
            v-model="themeController"
            class="theme-controller"
          />

          <svg
            aria-label="sun"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </g>
          </svg>

          <svg
            aria-label="moon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </g>
          </svg>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/configStore'
import { Minimize2 } from 'lucide-vue-next'

const configStore = useConfigStore()
const { locale } = useI18n()

const popupVisible = ref(false)

const toggleCard = () => {
  popupVisible.value = !popupVisible.value
}

// 弹窗按钮点击事件
const handleButtonClick = (buttonName: string) => {
  alert(`${buttonName} clicked!`)
}

// 弹窗位置
const popupStyle = ref({
  bottom: '20px',
  right: '20px',
})

locale.value = configStore.lang // 设置初始语言

// UI 语言切换
const changeLocale = (e: Event) => {
  const target = e.target as HTMLSelectElement
  configStore.lang = target.value
  locale.value = target.value
}

// 初始状态，默认为当前主题
const themeController = ref(false)

// 获取当前主题
const currentTheme = document.documentElement.getAttribute('data-theme')

// 根据当前主题状态设置 themeController 的初始值
if (currentTheme === 'dark') {
  themeController.value = true
}

// 切换主题函数
const toggleTheme = () => {
  const newTheme = themeController.value ? 'dark' : 'light'

  // 更新 data-theme 和 dark 类
  document.documentElement.setAttribute('data-theme', newTheme)
  document.documentElement.classList.toggle('dark', themeController.value)
}

// 监听 themeController 的变化
watch(themeController, toggleTheme)
</script>

<style scoped>
/* 自定义样式（如果需要的话） */
</style>
