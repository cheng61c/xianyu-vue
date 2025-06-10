<template>
  <div class="article-content">
    <!-- 导航 -->
    <div class="flex gap-4 items-center">
      <!-- 面包屑 -->
      <div class="breadcrumbs text-sm">
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
      </div>
    </div>

    <div class="flex gap-6 pr-1 pt-4">
      <!-- 左侧按钮 -->
      <ArticleActions :postData="postData" />

      <!-- 文章主体 -->
      <div v-html="postData?.content" class="tiptap w-full"></div>

      <!-- 右侧卡片 -->
      <div class="w-2/5 relative">
        <div class="flex flex-col gap-4 no-scrollbar p-2">
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
  </div>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import type { Api, ErrorResponse } from '@/types'
import type { Post } from '@/types/Post'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Home } from 'lucide-vue-next'
import { useConfigStore } from '@/stores/configStore'
import { generateTocFromHtml, type TocItem } from '@/utils/toc'
import { formatNumber, formatTime, lightHtml } from '@/hook/format'

import ScButton from '@/components/ScButton.vue'

import Dependencies from '@/components/post/details/Dependencies.vue'
import Author from '@/components/post/details/Author.vue'
import Releases from '@/components/post/details/Releases.vue'
import TableOfContents from '@/components/post/details/TableOfContents.vue'
import ArticleActions from '@/components/post/details/ArticleActions.vue'

const route = useRoute()
const router = useRouter()
const postData = ref<Post | null>(null)
const toast = useToast()
const tocList = ref<TocItem[]>([]) // 文章目录列表
const configStore = useConfigStore()

// interface Comment {
//   id: number
//   author: string
//   content: string
//   created_at: string
//   children?: Comment[] // 子评论
// }
// const newComment = ref('')
// const comments = ref<Comment[]>([
//   {
//     id: 1,
//     author: 'Alice',
//     content: '好文章！',
//     created_at: '2024-01-01',
//     children: [
//       {
//         id: 2,
//         author: 'Bob',
//         content: '我也觉得不错！',
//         created_at: '2024-01-02',
//       },
//     ],
//   },
// ])

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
      router.back()
    })
}

const goBack = () => {
  window.history.back()
}

onMounted(() => {
  const postId = route.params.postId
  console.log('Fetching details for post ID:', postId)
  getPostDetails(+postId)
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
