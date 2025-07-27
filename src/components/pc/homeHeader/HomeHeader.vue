<template>
  <header
    class="sticky top-0 z-10 w-full mx-auto px-4 flex h-16 justify-between items-center bg-background">
    <button
      class="flex justify-center items-center gap-2 cursor-pointer"
      @click="$router.push('/')">
      <Logo
        class="text-background-content"
        :style="{
          fill: themeStore.darkTheme ? 'rgba(255, 255, 255, 0.9)' : '#666666',
        }" />
      <div class="text-md text-background-content font-bold">
        {{ $t('other.title-logo') }}
      </div>
    </button>

    <HomeNav />

    <div class="flex gap-4 items-center">
      <ScLogin />
      <ScButton
        class="hidden md:block"
        noPd
        :icon="Mail"
        :iconSize="20"
        @click="
          $router.push({
            name: 'message',
          })
        ">
      </ScButton>
      <ThemeButton />
    </div>
  </header>
  <div v-if="show" class="flex justify-center w-full bg-warning/30">
    <span @click="toAnnouncement">{{ postData?.title }}</span>
    <ScButton
      class="ml-4"
      :icon="X"
      @click="offAnnouncement(postData?.id)"
      noPd
      noBg>
    </ScButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/global/configStore'
import { Logo } from '@/icon.js'
import ThemeButton from '@/components/common/ThemeButton.vue'
import HomeNav from './HomeNav.vue'
import ScLogin from './ScLogin.vue'
import { useThemeStore } from '@/stores/global/themeStore'
import type { Post } from '@/types/Post'
import { onMounted, ref } from 'vue'
import { postApi } from '@/apis'
import ScButton from '@/components/common/ScButton.vue'
import { Mail, X } from 'lucide-vue-next'
import { useAnnouncementStore } from '@/stores/global/announcementStore'
import { useRouter } from 'vue-router'

const announcementStore = useAnnouncementStore()
const themeStore = useThemeStore()
const configStore = useConfigStore()
const { locale } = useI18n()
const postData = ref<Post | null>(null)
const show = ref(false)
const router = useRouter()

locale.value = configStore.lang.value // 设置初始语言

const toAnnouncement = () => {
  show.value = false
  if (!postData.value) return
  router.push({
    name: 'postDetails',
    params: {
      postId: postData.value.id,
    },
  })
}

const getAnnouncement = (postList: Post[]): Post | null => {
  const popUpIds = new Set(announcementStore.popUps)
  const diffPost = postList.find((post) => !popUpIds.has(post.id))
  return diffPost ?? null
}

const offAnnouncement = (id?: number) => {
  if (id) {
    announcementStore.popUps.push(id)
    announcementStore.popUps = Array.from(new Set(announcementStore.popUps)) // 去重
  }
  show.value = false
}

onMounted(() => {
  postApi
    .getPostList({
      top: 2,
    })
    .then((res) => {
      postData.value = getAnnouncement(res.data.data.list)
      if (postData.value) {
        show.value = true
      }
    })
})
</script>
