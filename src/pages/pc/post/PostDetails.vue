<template>
  <div class="article-content">
    <!-- 导航 -->
    <div class="flex gap-4 items-center">
      <!-- 面包屑 -->
      <!-- <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <ScButton noPadding @click="goBack"> <Home :size="18" /> </ScButton>
          </li>
          <li>
            <RouterLink
              :to="{
                name: configStore.currentPlate.pathName,
                params: { plateId: configStore.currentPlateId },
              }">
              {{ configStore.currentPlate.name }}
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{
                name: postData?.type == 1 ? 'postList' : 'modList',
                params: { plateId: postData?.plate.id },
              }">
              {{ postData?.plate.name }}
            </RouterLink>
          </li>
          <li>{{ postData?.title }}</li>
        </ul>
      </div> -->
    </div>

    <div v-if="!errorPage" class="flex gap-6 pr-1 pt-4">
      <!-- 左侧按钮 -->
      <ArticleActions :postData="postData" @updatePost="getPostDetails" />

      <!-- 文章主体 -->
      <div class="tiptap flex-1 min-w-[70%]">
        <div v-html="postData?.content"></div>
        <div class="border-t border-gray my-8"></div>

        <!-- 评分 -->
        <Score
          v-if="postData && postData.type == 2"
          :postId="postData?.id"
          class="mb-4" />

        <!-- 评论区 -->
        <CommentArea :postData="postData"></CommentArea>
      </div>

      <!-- 右侧卡片 -->
      <div class="w-2/5 relative">
        <div class="flex flex-col gap-4 no-scrollbar p-2">
          <Card v-if="postData?.status == 2 || postData?.disabled == 1">
            <div class="text-red-500 text-lg font-bold">
              该帖子已被封禁或禁用
            </div>
            <div class="text-gray-content mt-2">当前正在使用管理员权限查看</div>
          </Card>

          <Card v-if="postData?.visible == 0">
            <div class="text-red-500 text-lg font-bold">该帖子已下架</div>
            <div class="text-gray-content mt-2">当前正在使用管理员权限查看</div>
          </Card>

          <!-- 目录 -->
          <TableOfContents :postData="postData" :tocList="tocList" />

          <!-- 作者 -->
          <Author :postData="postData" />

          <!-- 前置 -->
          <Dependencies :postData="postData" />

          <!-- 发布版 -->
          <Releases :postData="postData" />
        </div>
      </div>
    </div>
    <!-- 错误页面 -->
    <div v-else class="flex flex-col items-center justify-center h-full">
      <Card class="w-96 text-center">
        <h2 class="text-xl font-bold mb-4">帖子加载失败</h2>
        <img
          src="/public/wow.webp"
          alt="Error"
          class="w-auto h-40 mb-4 mx-auto" />
        <p class="text-gray-content mb-4">
          可能是帖子不存在或已被删除，您可以尝试刷新页面或返回上一页。
        </p>
        <ScButton @click="goBack" class="mt-2" Border>返回上一页</ScButton>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import type { Api, ErrorResponse } from '@/types'
import type { Post } from '@/types/Post'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { generateTocFromHtml, type TocItem } from '@/utils/toc'
import { formatNumber, formatTime, lightHtml } from '@/hook/format'

import ScButton from '@/components/common/ScButton.vue'

import Dependencies from '@/components/pc/post/details/Dependencies.vue'
import Author from '@/components/pc/post/details/Author.vue'
import Releases from '@/components/pc/post/details/Releases.vue'
import TableOfContents from '@/components/pc/post/details/TableOfContents.vue'
import ArticleActions from '@/components/pc/post/details/ArticleActions.vue'
import Card from '@/components/common/Card.vue'
import CommentArea from '@/components/pc/post/details/comment/CommentArea.vue'
import Score from '@/components/pc/post/details/score/Score.vue'

const route = useRoute()
const router = useRouter()
const postData = ref<Post | null>(null)
const toast = useToast()
const tocList = ref<TocItem[]>([]) // 文章目录列表

const errorPage = ref(false) // 错误页面标志

/** 获取帖子详情 */
const getPostDetails = async (postId: number) => {
  postApi
    .getPostDetail(postId)
    .then((response: Api) => {
      const data = response.data.data as Post
      data.content = lightHtml(data.content)
      data.createdAt = formatTime(data.createdAt)
      data.updatedAt = formatTime(data.updatedAt)
      data.commentCount = formatNumber(data.commentCount)
      data.likeCount = formatNumber(data.likeCount)
      data.badCount = formatNumber(data.badCount)
      data.postVersions = data.postVersions.map((item) => ({
        ...item,
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

onMounted(() => {
  const postId = route.params.postId
  console.log('Fetching details for post ID:', postId)
  getPostDetails(+postId)
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
</script>
