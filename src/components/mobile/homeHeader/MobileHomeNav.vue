<template>
  <div class="h-12 w-full flex justify-between items-center px-4 bg-background">
    <ScButton noPd @click="leftDrawer = true" :icon="Menu" :iconSize="20" />
    <HomeNav />
    <!-- <ScButton
      noPd
      @click="leftDrawer = true"
      :icon="CircleUserRound"
      :iconSize="20" /> -->
    <ScLogin />
  </div>

  <ScDrawer v-model="leftDrawer" position="left">
    <div class="bg-background w-64 h-full p-4">
      <h3 class="text-xl px-2">菜单</h3>
      <template v-if="postStore.plate">
        <AccordionItem v-model:open="open2">
          <template #title>测试工具箱</template>
          <template #content>
            <div class="flex flex-col">
              <div class="flex gap-4 items-center justify-between py-1">
                <div>{{ $t('d.yu-yan-qie-huan') }}</div>
                <!-- <select
                  :value="configStore.lang"
                  @change="changeLocale"
                  class="px-3 py-1 rounded border border-gray bg-gray/20">
                  <option value="zh">简体中文</option>
                  <option value="en">English</option>
                </select> -->
                <ScSelector
                  :options="configStore.langs"
                  v-model="configStore.lang"
                  class="w-32" />
              </div>

              <div class="flex gap-4 items-center justify-between py-2">
                <div>昼夜切换</div>
                <ThemeButton />
              </div>

              <div class="flex gap-4 items-center justify-between py-2">
                <div>{{ $t('d.ping-ban-xiao-bai-tiao-shi-pei') }}</div>
                <input
                  type="checkbox"
                  checked="checked"
                  class="toggle"
                  v-model="configStore.padAdaptation" />
              </div>

              <div
                class="flex gap-4 items-center justify-between py-2"
                @click="deleteUser">
                <div>{{ $t('d.shan-chu-deng-lu-xin-xi') }}</div>
                <button><Trash2 /></button>
              </div>
              <div
                class="flex gap-4 items-center justify-between py-2"
                @click="deleteAnnouncement">
                <div>{{ $t('d.shan-chu-gong-gao-yi-du-zhuang-tai') }}</div>
                <button><Trash2 /></button>
              </div>
              <div
                class="flex gap-4 items-center justify-between py-2"
                @click="deleteDrawer">
                <div>清空抽屉</div>
                <button><Trash2 /></button>
              </div>
            </div>
          </template>
        </AccordionItem>

        <div class="flex flex-col space-y-4 py-2 px-2">
          <div
            v-if="userStore.isLogin"
            class="flex gap-4 items-center justify-between py-2"
            @click="logout($t)">
            <div>退出登录</div>
            <button><LogOut /></button>
          </div>
        </div>
      </template>
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import ScDrawer from '@/components/common/ScDrawer.vue'
import AccordionItem from '@/components/common/ScAccordionItem.vue'
import { Menu, LogOut } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
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
import { logout } from '@/stores/module/user/service'

import { Trash2 } from 'lucide-vue-next'
import { useDrawertore } from '@/stores/global/drawerStore'
import ScSelector from '@/components/common/ScSelector.vue'

const postStore = usePostStore()
const leftDrawer = ref(false)

const open2 = ref(false)

const toast = useToast()
const configStore = useConfigStore()
const userStore = useUserStore()
const announcementStore = useAnnouncementStore()
const drawertore = useDrawertore()
const { locale, t } = useI18n()

locale.value = configStore.lang.value // 设置初始语言

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

watch(
  () => configStore.lang,
  () => {
    locale.value = configStore.lang.value // 监听语言变化
  },
  { immediate: true }
)

onMounted(() => {
  // 初始化或获取数据
  getPlate(t)
})
</script>

<style scoped>
input[type='checkbox'] {
  padding: 0;
}
</style>
