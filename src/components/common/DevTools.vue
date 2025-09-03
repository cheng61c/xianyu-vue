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
        $t('d.gong-ju-xiang')
      }}</span>
      <button
        @click="toggleCard"
        class="text-red-500 hover:text-red-700 focus:outline-none">
        <Minimize2 />
      </button>
    </div>

    <div class="flex flex-col space-y-4">
      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('d.yu-yan-qie-huan') }}</div>
        <ScSelector
          :options="configStore.langs"
          v-model="configStore.lang"
          class="w-32" />
      </div>

      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('d.zhou-ye-qie-huan') }}</div>
        <ThemeButton />
      </div>

      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('d.ping-ban-xiao-bai-tiao-shi-pei') }}</div>
        <input
          type="checkbox"
          checked="checked"
          class="toggle"
          v-model="configStore.padAdaptation" />
      </div>

      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('d.dan-chuang') }}</div>
        <button @click="onToast"><Forward /></button>
      </div>
      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('d.shan-chu-deng-lu-xin-xi') }}</div>
        <button @click="deleteUser"><Trash2 /></button>
      </div>
      <div class="flex gap-4 items-center justify-between">
        <div>{{ $t('d.shan-chu-gong-gao-yi-du-zhuang-tai') }}</div>
        <button @click="deleteAnnouncement"><Trash2 /></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/global/configStore'
import { Minimize2, Forward, Trash2 } from 'lucide-vue-next'
import ThemeButton from '@/components/common/ThemeButton.vue'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/module/user/userStore'
import type { UserType } from '@/types'
import { useAnnouncementStore } from '@/stores/global/announcementStore'
import ScSelector from '@/components/common/ScSelector.vue'
import CreatrPostJump from './CreatrPostJump.vue'

const toast = useToast()
const configStore = useConfigStore()
const userStore = useUserStore()
const announcementStore = useAnnouncementStore()
const { locale, t } = useI18n()

const popupVisible = ref(false)

const toggleCard = () => {
  popupVisible.value = !popupVisible.value
}

// 弹窗位置
const popupStyle = ref({
  bottom: '20px',
  right: '20px',
})

locale.value = configStore.lang.value // 设置初始语言

// UI 语言切换
watch(
  () => configStore.lang,
  () => {
    locale.value = configStore.lang.value // 监听语言变化
  },
  { immediate: true }
)

const onToast = () => {
  toast.success(
    {
      component: CreatrPostJump,
      listeners: {
        click: () => {},
      },
    },
    {
      timeout: 30000,
      status: 'success',
    }
  )
}
const deleteUser = () => {
  userStore.userInfo = {} as UserType
  userStore.isLogin = false
  userStore.token = ''
  toast.success(t('t.yong-hu-huan-cun-yi-qing-chu'))
}
const deleteAnnouncement = () => {
  announcementStore.popUps = []
  announcementStore.banners = []
  toast.success(t('t.gong-gao-yi-du-zhuang-tai-yi-qing-chu'))
}
</script>
