<template>
  <!-- 悬浮球 -->
  <div
    v-if="!popupVisible"
    class="fixed bottom-4 right-4 w-12 h-12 flex bg-blue-500 rounded-full items-center justify-center cursor-pointer transition-all ease-in-out z-50 no-select lg:w-16 lg:h-16"
    @click="toggleCard">
    <span class="text-white text-xl no-select">⚽</span>
  </div>

  <!-- 弹窗卡片 -->
  <div
    v-if="popupVisible"
    class="fixed bottom-4 right-4 w-72 bg-base-100 dark:bg-base-300 rounded-lg shadow-lg p-4 transition-all ease-in-out z-50"
    :style="popupStyle">
    <div class="flex justify-between items-center mb-4">
      <span class="font-semibold text-xl text-info no-select">{{
        $t('gong-ju-xiang')
      }}</span>
      <button
        @click="toggleCard"
        class="text-red-500 hover:text-red-700 focus:outline-none">
        <Minimize2 />
      </button>
    </div>

    <div class="flex flex-col space-y-4">
      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('yu-yan-qie-huan') }}</div>
        <select
          :value="configStore.lang"
          @change="changeLocale"
          class="px-3 py-2 rounded bg-base-200">
          <option value="zh">简体中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('zhou-ye-qie-huan') }}</div>
        <ThemeButton />
      </div>

      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('tang-chuang') }}</div>
        <button @click="onToast"><Forward /></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/configStore'
import { Minimize2, Forward } from 'lucide-vue-next'
import ThemeButton from '@/components/homeHeader/ThemeButton.vue'
import { useToast } from 'vue-toastification'
import { notify } from '@kyvg/vue3-notification'

const toast = useToast()
const configStore = useConfigStore()
const { locale } = useI18n()

const popupVisible = ref(false)

const toggleCard = () => {
  popupVisible.value = !popupVisible.value
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

const onToast = () => {
  notify('Button clicked!')
  toast.success('Button clicked!')
}
</script>

<style scoped>
/* 自定义样式（如果需要的话） */
</style>
