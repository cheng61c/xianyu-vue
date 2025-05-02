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
          <Card>
            <h3 class="text-lg font-bold mb-2">目录</h3>
            <ul class="space-y-1 text-sm">
              <li
                v-for="item in tocList"
                :key="item.id"
                :style="{ paddingLeft: `${(item.level - 1) * 12}px` }"
              >
                <a
                  href="javascript:void(0)"
                  @click="
                    scrollToAnchorInContainer(item.id, '.article-content')
                  "
                >
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
import CommentItem from './CommentItem.vue'
import Card from '../Card.vue'
import TipTap from '../TipTap.vue'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const postData = ref<Post | null>(null)
const toast = useToast()
const tocList = ref<{ level: number; text: string; id: string }[]>([]) // 文章目录列表
const configStore = useConfigStore()

const html1 = ref(`
<h1>测试测试，标题</h1><blockquote><p>哈哈哈</p></blockquote><h3>飒飒</h3><p></p><p></p><h3>gdsd</h3><p>a</p><p></p><p>as</p><p>vc</p><p>as</p><p>ca</p><p>sc</p><p></p><p>as</p><p>cas</p><p>c</p><p>asc</p><p>a</p><p>sc</p><p>a</p><p>sc</p><p>as</p><p>c</p><p>as</p><p>v</p><p>a</p><p>v</p><p>as</p><p>cas</p><p>c</p><p>as</p><p>c</p><p>as</p><p>cas</p><p>c</p><p>as</p><h5>acascasc</h5><p></p><p></p><h1>ascascas</h1><p></p><p></p>
`) // 帖子内容

const html2 = ref(``)

function scrollToAnchorInContainer(id: string, containerSelector: string) {
  const el = document.getElementById(id)
  const container = document.querySelector(containerSelector)

  if (el && container) {
    const elTop = el.getBoundingClientRect().top
    const containerTop = container.getBoundingClientRect().top
    const scrollOffset = elTop - containerTop + container.scrollTop

    container.scrollTo({
      top: scrollOffset,
      behavior: 'smooth',
    })
  }
}
function addHeadingIds(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

  headings.forEach((heading, index) => {
    const text = heading.textContent?.trim() || `heading-${index}`
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '') // 移除特殊符号
    heading.id = id
  })

  return doc.body.innerHTML
}

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
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    tocList.value = []

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1))
      const text = heading.textContent?.trim() || `标题 ${index}`
      const id = `heading-${index}`

      heading.setAttribute('id', id) // 设置锚点
      tocList.value.push({ level, text, id })
    })

    if (postData.value) {
      // 更新带 ID 的 HTML
      postData.value.content = doc.body.innerHTML
    }

    html2.value = addHeadingIds(html1.value)
  },
  { immediate: true }
)
</script>
