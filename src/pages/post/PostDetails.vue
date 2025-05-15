<template>
  <div class="article-content">
    <!-- 导航 -->
    <div class="flex gap-4 items-center">
      <button
        class="text-sm text-background-content border border-gray rounded-sm px-2 py-0.5"
        @click="goBack">
        返回
      </button>
      <!-- 面包屑 -->
      <div class="breadcrumbs text-sm">
        <ul>
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
      <!-- 文章主体 -->
      <div v-html="postData?.content" class="tiptap w-full"></div>

      <!-- 目录卡片 -->
      <div class="w-1/4 relative">
        <div
          class="sticky top-4 flex flex-col gap-4 overflow-y-auto no-scrollbar p-2">
          <Card>
            <h3 class="text-lg font-bold mb-2">目录</h3>
            <ul class="space-y-1 text-sm">
              <li
                v-for="item in tocList"
                :key="item.id"
                :style="{ paddingLeft: `${(item.level - 1) * 12}px` }">
                <a :href="`#${item.id}`" class="hover:underline text-blue-600">
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </Card>

          <Card v-if="postData">
            <div class="flex gap-2 items-center">
              <Avatar
                :src="postData.author.headImg || ''"
                :alt="postData.author.nickname"
                :size="32" />
              <div class="text-background-content font-bold">
                <span>{{ postData.author.nickname }}</span>
              </div>
            </div>
          </Card>
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
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import Card from '@/components/Card.vue'
import { useConfigStore } from '@/stores/configStore'
import { generateTocFromHtml, type TocItem } from '@/utils/toc'
import { formatLink, lightHtml } from '@/hook/format'
import Avatar from '@/components/Avatar.vue'

const route = useRoute()
const postData = ref<Post | null>(null)
const toast = useToast()
const tocList = ref<TocItem[]>([]) // 文章目录列表
const configStore = useConfigStore()

interface Comment {
  id: number
  author: string
  content: string
  created_at: string
  children?: Comment[] // 子评论
}
const newComment = ref('')
const comments = ref<Comment[]>([
  {
    id: 1,
    author: 'Alice',
    content: '好文章！',
    created_at: '2024-01-01',
    children: [
      {
        id: 2,
        author: 'Bob',
        content: '我也觉得不错！',
        created_at: '2024-01-02',
      },
    ],
  },
])

/** 获取帖子详情 */
const getPostDetails = async (postId: number) => {
  postApi
    .getPostDetail(postId)
    .then((response: Api) => {
      const data = response.data.data
      data.content = lightHtml(data.content)
      toast.success('Post details fetched successfully!')
      tocList.value = generateTocFromHtml(data.content)
      postData.value = data
    })
    .catch((error: ErrorResponse) => {
      console.log('Error fetching post details:', error)

      toast.error(error.msg)
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
</script>
