<template>
  <div class="h-12 w-full flex justify-between items-center px-4 bg-background">
    <ScButton noPd @click="leftDrawer = true" :icon="Menu" :iconSize="20" />
    <HomeNav />
    <ScButton
      noPd
      @click="leftDrawer = true"
      :icon="CircleUserRound"
      :iconSize="20" />
  </div>

  <ScDrawer v-model="leftDrawer" position="left">
    <div class="bg-background w-64 h-full p-4">
      <h3 class="text-xl px-2">菜单</h3>
      <template v-if="postStore.plate">
        <AccordionItem v-model:open="open1">
          <template #title>标题 1</template>
          <template #content> 折叠内容一段文本，你可以插入任意内容。 </template>
        </AccordionItem>

        <AccordionItem v-model:open="open2">
          <template #title>标题 2</template>
          <template #content> 第二段内容，默认展开。 </template>
        </AccordionItem>

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
            <div>平板小白条适配</div>
            <input
              type="checkbox"
              checked="checked"
              class="toggle"
              v-model="configStore.padAdaptation" />
          </div>

          <div
            class="flex gap-4 items-center justify-between"
            @click="deleteUser">
            <div>{{ $t('qing-kong-yong-hu-huan-cun') }}</div>
            <button><Trash2 /></button>
          </div>
          <div
            class="flex gap-4 items-center justify-between"
            @click="deleteAnnouncement">
            <div>{{ $t('qing-kong-gong-gao-yi-du-zhuang-tai') }}</div>
            <button><Trash2 /></button>
          </div>
          <div
            class="flex gap-4 items-center justify-between"
            @click="deleteDrawer">
            <div>清空抽屉</div>
            <button><Trash2 /></button>
          </div>
        </div>

        <ScLogin />
      </template>
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import ScDrawer from '@/components/common/ScDrawer.vue'
import AccordionItem from '@/components/common/ScAccordionItem.vue'
import { Menu, CircleUserRound } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { usePostStore } from '@/stores/module/post/postStore'
import { getPlate } from '@/stores/module/post/service'
import HomeNav from '@/components/pc/homeHeader/HomeNav.vue'
import ScLogin from '@/components/pc/homeHeader/ScLogin.vue'
import { useToast } from 'vue-toastification'
import type { UserType } from '@/types'
import { useConfigStore } from '@/stores/global/configStore'
import { useUserStore } from '@/stores/module/user/userStore'
import { useAnnouncementStore } from '@/stores/global/announcementStore'
import { useI18n } from 'vue-i18n'
import ThemeButton from '@/components/common/ThemeButton.vue'

import { Trash2 } from 'lucide-vue-next'
import { useDrawertore } from '@/stores/global/drawerStore'

const postStore = usePostStore()
const leftDrawer = ref(false)

const open1 = ref(false)
const open2 = ref(true)

const toast = useToast()
const configStore = useConfigStore()
const userStore = useUserStore()
const announcementStore = useAnnouncementStore()
const drawertore = useDrawertore()
const { locale } = useI18n()

locale.value = configStore.lang // 设置初始语言

// UI 语言切换
const changeLocale = (e: Event) => {
  const target = e.target as HTMLSelectElement
  configStore.lang = target.value
  locale.value = target.value
}

const deleteUser = () => {
  userStore.userInfo = {} as UserType
  userStore.isLogin = false
  userStore.token = ''
  toast.success('用户缓存已清除')
}
const deleteAnnouncement = () => {
  announcementStore.popUps = []
  announcementStore.banners = []
  toast.success('公告已读状态已清除')
}

const deleteDrawer = () => {
  drawertore.drawers = []
  toast.success('清空弹窗')
}

onMounted(() => {
  // 初始化或获取数据
  getPlate()
})
</script>

<style scoped>
input[type='checkbox'] {
  padding: 0;
}
</style>
