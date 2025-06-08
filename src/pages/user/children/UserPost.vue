<template>
  <ScSearch
    v-if="posts.length"
    key="user-post-search"
    placeholder="搜索帖子标题或内容"
    @search="search"
    v-model="searchText"
    class="max-w-5xl min-w-4xl w-full" />

  <Card
    v-for="(post, postIndex) in posts"
    :key="post.id"
    class="stats max-w-5xl min-w-4xl w-full">
    <div class="flex justify-center items-center">
      <!-- 左侧封面图 -->
      <div class="relative w-40 h-24 flex-shrink-0">
        <ScImage
          :src="post.cover"
          alt="封面图"
          class="w-full h-full object-cover rounded" />
        <!-- <span
          class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded"
          >00:25</span
        > -->
      </div>

      <!-- 右侧文字信息 -->
      <div class="ml-4 flex flex-col justify-between flex-grow h-24">
        <!-- 标题 -->
        <div
          class="flex items-center gap-2"
          @click.stop="
            $router.push({ name: 'postDetails', params: { postId: post.id } })
          ">
          {{ post.title }}
          <ScTag
            size="sm"
            :bgColor="
              post.visible == 1 ? 'var(--color-green)' : 'var(--color-error)'
            ">
            {{ post.visible == 1 ? '正常' : '下架' }}
          </ScTag>
        </div>
        <!-- 时间 -->
        <div class="text-sm text-gray-500">{{ post.createdAt }}</div>
        <!-- 底部数据 -->
        <div class="flex items-center text-sm text-gray-500 space-x-4 mt-2">
          <ScButton
            class="flex items-center"
            :icon="Eye"
            iconSize="16"
            noBg
            noPd>
            {{ post.views }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="MessageSquare"
            iconSize="16"
            noBg
            noPd>
            {{ post.commentCount }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="ThumbsUp"
            iconSize="16"
            noBg
            noPd>
            {{ post.likeCount }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="ThumbsDown"
            iconSize="16"
            noBg
            noPd>
            {{ post.badCount }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="Flame"
            iconSize="16"
            noBg
            noPd>
            {{ post.heat }}
          </ScButton>
        </div>
      </div>

      <div class="flex gap-2 h-24 items-center justify-end flex-wrap">
        <ScButton
          class="text-sm px-4 border border-gray hover:border-active"
          :icon="SquarePen"
          :iconSize="16"
          disabled>
          编辑
        </ScButton>
        <ScButton
          class="text-sm px-4 border border-gray hover:border-active"
          :icon="post.visible == 1 ? ArrowDownFromLine : ArrowUpToLine"
          :iconSize="16"
          @click="unpublishItem(postIndex)">
          {{ post.visible == 1 ? '下架' : '发布' }}
        </ScButton>
        <ScButton
          class="text-sm text-error px-4 border border-gray hover:border-active"
          :icon="Trash2"
          :iconSize="16"
          @click="deleteItem(postIndex)">
          删除
        </ScButton>
      </div>
    </div>
  </Card>

  <Pagination
    v-if="posts.length"
    :current-page="pagination.page"
    :total-items="pagination.count"
    :page-size="pagination.limit"
    @page-change="toPage" />

  <EmptyState
    v-if="posts.length === 0"
    title="暂无帖子"
    description="你还没有发布任何帖子哦~"
    iconSize="64"
    iconColor="#ccc"
    :icon="Package"
    class="mt-8"
    action="前往发帖"
    :actionIcon="SquareArrowOutUpRight"
    @action-click="$router.push({ name: 'publish' })" />

  <ScModal v-model="isDeletePost">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">确认删除帖子</div>
      <div class="">帖子标题: {{ posts[currentPostIndex].title }}</div>
      <div class="mb-4">
        <span>你确定要删除此帖子吗?</span>
        <span class="text-error">此操作无法撤回</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="isDeletePost = false">
          取消
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePost">
          确认删除
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { useUserStore } from '@/stores/userStore'
import type { UserType } from '@/types'
import { onMounted, ref } from 'vue'
import {
  ThumbsUp,
  ThumbsDown,
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  MessageSquare,
  Flame,
  Trash2,
  Eye,
  SquarePen,
  SquareArrowOutUpRight,
} from 'lucide-vue-next'
import { userApi, postApi } from '@/apis'
import { extractImageSrcs } from '@/hook/regex'
import { formatTime } from '@/hook/format'
import ScImage from '@/components/ScImage.vue'
import ScButton from '@/components/ScButton.vue'
import type { Post } from '@/types/Post'
import { useToast } from 'vue-toastification'
import ScDivider from '@/components/ScDivider.vue'
import ScModal from '@/components/ScModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import ScSearch from '@/components/user/ScSearch.vue'
import Pagination from '@/components/Pagination.vue'
import ScTag from '@/components/ScTag.vue'

const userStore = useUserStore()
const userInfo = ref<UserType>(userStore.userInfo)
const toast = useToast()

const posts = ref<Post[]>([])
const isDeletePost = ref(false)
const currentPostIndex = ref(-1)

const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
  count: 0,
})
const searchText = ref('')
const isSearch = ref(false)

const getPosts = () => {
  if (isSearch.value) {
    search(searchText.value)
    return
  }
  userApi
    .getUserPosts({
      userId: userInfo.value.id,
      type: 1,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    .then((response) => {
      posts.value = response.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
        return item
      })
      pagination.value = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
        count: response.data.data.count,
      }
    })
    .catch((error) => {
      console.error('Error fetching posts:', error)
    })
}

const unpublishItem = (postIndex: number) => {
  const item = posts.value[postIndex]
  if (!item) {
    toast.error('帖子不存在')
    return
  }
  postApi
    .updatePost({
      id: item.id,
      visible: item.visible == 1 ? 0 : 1,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        toast.success('操作成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
}

const deleteItem = (postIndex: number) => {
  isDeletePost.value = true
  currentPostIndex.value = postIndex
}

const deletePost = () => {
  const item = posts.value[currentPostIndex.value]
  if (!item) {
    toast.error('帖子不存在')
    return
  }
  postApi
    .deletePost(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        toast.success('删除成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
  isDeletePost.value = false
}

const toPage = (page: number) => {
  pagination.value.page = page
  getPosts()
}

const search = (key: string) => {
  if (key.trim() === '') {
    isSearch.value = false
    pagination.value = {
      page: 1,
      limit: 5,
      total: 0,
      count: 0,
    }
    getPosts()
    return
  }
  searchText.value = key.trim()
  isSearch.value = true
  userApi
    .getUserPosts({
      userId: userInfo.value.id,
      type: 2,
      key: key,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    .then((response) => {
      posts.value = response.data.data.list.map((item: any) => {
        const imgs = extractImageSrcs(item.content)
        item.cover = imgs.length > 0 ? imgs[0] : ''
        item.createdAt = formatTime(item.createdAt)
        return item
      })
      pagination.value = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
        count: response.data.data.count,
      }
    })
    .catch((error) => {
      console.error('Error searching posts:', error)
    })
}

onMounted(() => {
  getPosts()
})
</script>
