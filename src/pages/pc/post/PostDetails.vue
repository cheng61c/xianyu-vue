<template>
  <div class="pb-2">
    <!-- 导航 -->
    <!-- 面包屑 -->
    <div class="breadcrumbs text-sm ml-4">
      <ul>
        <li>
          <ScButton noPadding @click="goBack"> <Home :size="18" /> </ScButton>
        </li>
        <li>
          <RouterLink
            :to="{
              name: postData?.type == 1 ? 'postList' : 'modList',
              params: { plateId: postData?.plate.id },
            }">
            {{ postData?.type == 1 ? '交流帖子' : '资源下载' }}
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

    <div v-if="!errorPage" class="flex gap-6 pr-1 pt-4">
      <!-- 左侧按钮 -->
      <ArticleActions :postData="postData" @updatePost="getPostData" />

      <!-- 文章主体 -->
      <div class="tiptap flex-1 w-7/10">
        <div ref="htmlContainer" v-html="postData?.content"></div>
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
      <div class="min-w-2/10 relative">
        <div class="flex flex-col gap-4 no-scrollbar p-2">
          <Card v-if="postData?.status == 2 || postData?.disabled == 1">
            <div class="text-red-500 text-lg font-bold">
              {{ $t('d.gai-tie-zi-yi-bei-feng-jin-huo-jin-yong') }}
            </div>
            <div class="text-gray-content mt-2">
              {{
                $t(
                  'd.dang-qian-zheng-zai-shi-yong-guan-li-yuan-quan-xian-cha-kan'
                )
              }}
            </div>
          </Card>

          <Card v-if="postData?.visible == 0">
            <div class="text-red-500 text-lg font-bold">
              {{ $t('d.gai-tie-zi-yi-xia-jia') }}
            </div>
            <div class="text-gray-content mt-2">
              {{
                $t(
                  'd.dang-qian-zheng-zai-shi-yong-guan-li-yuan-quan-xian-cha-kan'
                )
              }}
            </div>
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
        <h2 class="text-xl font-bold mb-4">
          {{ $t('d.tie-zi-jia-zai-shi-bai') }}
        </h2>
        <img
          src="/public/wow.webp"
          alt="Error"
          class="w-auto h-40 mb-4 mx-auto" />
        <p class="text-gray-content mb-4">
          {{
            $t(
              'd.ke-neng-shi-tie-zi-bu-cun-zai-huo-yi-bei-shan-chu-nin-ke-yi-chang-shi-shua-xin-ye-mian-huo-fan-hui-shang-yi-ye'
            )
          }}
        </p>
        <ScButton @click="goBack" class="mt-2" Border>{{
          $t('b.fan-hui-shang-yi-ye')
        }}</ScButton>
      </Card>
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
import type { Post } from '@/types/Post'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type TocItem } from '@/utils/toc'
import { Home, X } from 'lucide-vue-next'
import ScButton from '@/components/common/ScButton.vue'
import Dependencies from '@/components/pc/post/details/Dependencies.vue'
import Author from '@/components/pc/post/details/Author.vue'
import Releases from '@/components/pc/post/details/Releases.vue'
import TableOfContents from '@/components/pc/post/details/TableOfContents.vue'
import ArticleActions from '@/components/pc/post/details/ArticleActions.vue'
import Card from '@/components/common/Card.vue'
import CommentArea from '@/components/pc/post/details/comment/CommentArea.vue'
import Score from '@/components/pc/post/details/score/Score.vue'
import ScModal from '@/components/common/ScModal.vue'
import ZoomableImage from '@/components/common/ScZoomableImage.vue'
import { usePostStore } from '@/stores/module/post/postStore'
import { getPostDetails } from '@/stores/module/post/service'

const route = useRoute()
const router = useRouter()
const postData = ref<Post | null>(null)

const tocList = ref<TocItem[]>([]) // 文章目录列表
const postStore = usePostStore() // 获取帖子存储
const imageModal = ref(false) // 图片查看模态框
const imgurl = ref('') // 图片查看地址
const htmlContainer = ref<HTMLElement | null>(null) // HTML内容容器

const errorPage = ref(false) // 错误页面标志

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
  // console.log('Image clicked:', (e.target as HTMLImageElement).src)
  imageModal.value = true
  imgurl.value = (e.target as HTMLImageElement).src
}

const getPostData = async (id: number) => {
  const details = await getPostDetails(id)
  postData.value = details.post
  tocList.value = details.toc
}

onMounted(async () => {
  const postId = route.params.postId
  const details = await getPostDetails(+postId)
  if (!details.post) {
    errorPage.value = true // 设置错误页面标志
    return
  } else {
    postData.value = details.post
    tocList.value = details.toc
  }

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
