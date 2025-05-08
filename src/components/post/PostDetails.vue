<template>
  <div class="article-content h-[calc(100vh-4rem)] overflow-y-auto">
    <!-- 导航 -->
    <div class="flex gap-4 items-center">
      <button
        class="text-sm text-background-content border border-gray rounded-sm px-2 py-0.5"
        @click="goBack"
      >
        返回
      </button>
      <!-- 面包屑 -->
      <div class="breadcrumbs text-sm">
        <ul>
          <li>{{ configStore.currentPlate.name }}</li>
          <li>
            <RouterLink
              :to="{
                name: postData?.type == 1 ? 'postList' : 'modList',
                params: { plateId: postData?.plate.id },
              }"
            >
              {{ postData?.plate.name }}
            </RouterLink>
          </li>
          <li>{{ postData?.title }}</li>
        </ul>
      </div>
    </div>

    <div class="flex gap-6 pr-1 pt-4">
      <!-- 文章主体 -->
      <div v-html="html2" class="tiptap w-full"></div>

      <!-- 目录卡片 -->
      <div class="w-1/4 relative">
        <div
          class="sticky top-4 flex flex-col gap-4 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar"
        >
          <Card>
            <h3 class="text-lg font-bold mb-2">目录</h3>
            <ul class="space-y-1 text-sm">
              <li
                v-for="item in tocList"
                :key="item.id"
                :style="{ paddingLeft: `${(item.level - 1) * 12}px` }"
              >
                <a :href="`#${item.id}`" class="hover:underline text-blue-600">
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { post } from '@/apis'
import type { Api, ErrorResponse } from '@/types'
import type { Post } from '@/types/Post'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import Card from '../Card.vue'
import { useConfigStore } from '@/stores/configStore'
import { generateTocFromHtml, type TocItem } from '@/utils/toc'

const route = useRoute()
const postData = ref<Post | null>(null)
const toast = useToast()
const tocList = ref<TocItem[]>([]) // 文章目录列表
const configStore = useConfigStore()

const html1 = ref(`
<h4 id="heading-32">是擦擦</h4><p></p><h1 id="heading-33">擦擦</h1>
`) // 帖子内容

const html2 = ref(``)

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
  post
    .getPostDetail(postId)
    .then((response: Api) => {
      console.log('Post details:', response)
      postData.value = response.data.data
      toast.success('Post details fetched successfully!')
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

watch(
  () => html1.value,
  (html) => {
    if (!html) return

    tocList.value = generateTocFromHtml(html)

    if (postData.value) {
      postData.value.content = html
    }

    html2.value = html // 已经包含 id，无需处理
  },
  { immediate: true }
)
</script>
