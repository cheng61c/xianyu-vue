<template>
  <div class="px-4">
    <!-- 导航 -->
    <div class="flex justify-between text-sm h-12">
      <ScButton noPd :icon="ChevronLeft" :icon-size="22" @click="goBack">
      </ScButton>
      <ScButton noPd :icon="Settings" :icon-size="22" @click="goBack">
        管理
      </ScButton>
    </div>

    <!-- 提示词 -->
    <div v-if="postData?.status == 2 || postData?.disabled == 1">
      <div class="text-red-500 text-lg font-bold">该帖子已被封禁或禁用</div>
      <div class="text-gray-content mt-2">当前正在使用管理员权限查看</div>
    </div>
    <div v-if="postData?.visible == 0">
      <div class="text-red-500 text-lg font-bold">该帖子已下架</div>
      <div class="text-gray-content mt-2">当前正在使用管理员权限查看</div>
    </div>

    <!-- 详情 -->
    <div v-if="!errorPage" class="flex flex-col w-full gap-6 pr-1 pt-4">
      <!-- 标题 -->
      <h3 class="text-lg font-bold">{{ postData?.title }}</h3>
      <!-- 作者 -->
      <div v-if="postData" class="flex gap-2 items-center">
        <Avatar
          :src="postData.author.headImg || ''"
          :alt="postData.author.nickname"
          :size="28" />
        <div class="flex flex-wrap gap-x-1 items-center">
          <span class="text-background-content">
            {{ postData.author.nickname }}
          </span>
          <ScRole :user="postData.author" size="sm"></ScRole>
        </div>
      </div>

      <!-- 文章主体 -->
      <div class="tiptap">
        <div ref="htmlContainer" v-html="postData?.content"></div>
        <div class="border-t border-gray my-8"></div>

        <div class="flex flex-col gap-2">
          <!-- 前置 -->
          <Dependencies :postData="postData" />

          <!-- 发布版 -->
          <Releases :postData="postData" />

          <!-- 评分 -->
          <Score
            v-if="postData && postData.type == 2"
            :postId="postData?.id"
            class="mb-4" />
        </div>
      </div>

      <!-- 评论区 -->
      <MobileCommentArea :postData="postData"></MobileCommentArea>
    </div>
    <!-- 错误页面 -->
    <div v-else class="flex flex-col items-center">
      <h2 class="text-xl font-bold my-4">帖子加载失败</h2>
      <img
        src="/public/wow.webp"
        alt="Error"
        class="w-auto h-40 mb-4 mx-auto" />
      <p class="text-gray-content mb-4">
        可能是帖子不存在或已被删除，您可以尝试刷新页面或返回上一页。
      </p>
      <ScButton @click="goBack" class="mt-2" Border>返回上一页</ScButton>
    </div>
  </div>

  <ScModal v-model="imageModal">
    <div class="relative w-[90vw] h-[90vh] overflow-hidden">
      <ZoomableImage :src="imgurl" @click-outside="imageModal = false" />
      <button
        class="absolute z-[10] top-[5rem] right-[5rem] rounded-full w-10 h-10 border border-error hover:border-active/80 text-error hover:text-active/80"
        @click="imageModal = false">
        <X class="mx-auto" />
      </button>
    </div>
  </ScModal>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import type { Api, ErrorResponse } from '@/types'
import type { Post } from '@/types/Post'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { generateTocFromHtml, type TocItem } from '@/utils/toc'
import { formatNumber, formatTime, lightHtml } from '@/utils/format'

import { ChevronLeft, X, Settings } from 'lucide-vue-next'
import ScButton from '@/components/common/ScButton.vue'
import Dependencies from '@/components/pc/post/details/Dependencies.vue'
import Avatar from '@/components/common/Avatar.vue'
import ScRole from '@/components/common/ScRole.vue'
import Releases from '@/components/pc/post/details/Releases.vue'
import Score from '@/components/pc/post/details/score/Score.vue'
import ScModal from '@/components/common/ScModal.vue'
import ZoomableImage from '@/components/common/ScZoomableImage.vue'
import { formatImageSrcsInHtml } from '@/utils/regex'
// import { usePostStore } from '@/stores/module/post/postStore'
import MobileCommentArea from '@/components/mobile/post/details/comment/MobileCommentArea.vue'

const route = useRoute()
const router = useRouter()
const postData = ref<Post | null>(null)
const toast = useToast()
const tocList = ref<TocItem[]>([]) // 文章目录列表
// const postStore = usePostStore() // 获取帖子存储
const imageModal = ref(false) // 图片查看模态框
const imgurl = ref('') // 图片查看地址
const htmlContainer = ref<HTMLElement | null>(null) // HTML内容容器

const errorPage = ref(false) // 错误页面标志

/** 获取帖子详情 */
const getPostDetails = async (postId: number) => {
  postApi
    .getPostDetail(postId)
    .then((response: Api) => {
      const data = response.data.data as Post
      data.content = lightHtml(formatImageSrcsInHtml(data.content))
      data.createdAt = formatTime(data.createdAt)
      data.updatedAt = formatTime(data.updatedAt)
      data.commentCount = formatNumber(data.commentCount)
      data.likeCount = formatNumber(data.likeCount)
      data.badCount = formatNumber(data.badCount)
      data.postVersions = data.postVersions.map((item) => ({
        ...item,
        content: lightHtml(formatImageSrcsInHtml(item.content)),
        createdAt: formatTime(item.createdAt),
      }))
      tocList.value = generateTocFromHtml(data.content)
      postData.value = data
    })
    .catch((error: ErrorResponse) => {
      console.log('Error fetching post details:', error)

      toast.error(error.msg)
      errorPage.value = true
    })
}

const goBack = () => {
  if (window.history.length > 2) {
    window.history.back()
  } else {
    router.push({ name: 'Home' })
  }
}

const bindImageClickEvents = () => {
  const container = htmlContainer.value
  if (!container) return
  const images = container.querySelectorAll('img')
  images.forEach((img) => {
    img.style.cursor = 'pointer'
    img.addEventListener('click', openImg)
  })
}

const openImg = (e: MouseEvent) => {
  console.log('Image clicked:', (e.target as HTMLImageElement).src)

  imageModal.value = true
  imgurl.value = (e.target as HTMLImageElement).src
}

onMounted(() => {
  const postId = route.params.postId
  console.log('Fetching details for post ID:', postId)
  getPostDetails(+postId)
  nextTick(() => {
    bindImageClickEvents()
  })
})

onUnmounted(() => {
  postData.value = null // 清理数据
  tocList.value = [] // 清理目录列表
  errorPage.value = false // 重置错误页面标志
  console.log('Post details component unmounted, data cleared.')
})

watch(
  () => route.params,
  (newParams) => {
    const postId = newParams.postId
    console.log('Fetching details for post ID:', postId)
    getPostDetails(+postId)
  }
)

watch(postData, async () => {
  await nextTick()
  bindImageClickEvents()
})
</script>
