<template>
  <Card
    v-if="userStore.isLogin"
    v-for="(post, postIndex) in posts"
    :key="post.id"
    class="stats max-w-5xl min-w-4xl w-full">
    <div class="flex justify-between items-center">
      <!-- 右侧文字信息 -->
      <div class="ml-4 flex flex-col">
        <!-- 标题 -->
        <div class="flex items-center gap-2">
          {{ post.title }}
          <ScTag
            v-if="post.status == 1 || post.status == 3"
            size="sm"
            :status="post.visible == 1 ? 'success' : 'warning'">
            {{ post.visible == 1 ? '发布中' : '下架' }}
          </ScTag>
          <ScTag v-if="post.status == 2" size="sm" status="error"> 封禁 </ScTag>
          <ScTag size="sm">
            {{ post.level == 1 ? '个人服' : '社区服' }}
          </ScTag>
        </div>
      </div>
      <div>发布时间: {{ post.createdAt }}</div>
      <div>服务器地址: {{ post.url }}</div>

      <div class="flex gap-2 items-center flex-wrap">
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

  <Card v-if="!userStore.isLogin" class="stats max-w-5xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      您还未登录，请先登录后再进行操作。
    </div>
  </Card>

  <div v-if="userStore.isLogin" class="max-w-5xl min-w-4xl w-full">
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
    </div>
    <Pagination
      v-else-if="posts.length"
      :current-page="pagination.page"
      :total-items="pagination.count"
      :page-size="pagination.limit"
      @page-change="toPage" />
  </div>

  <EmptyState
    v-if="posts.length === 0 && userStore.isLogin"
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
import Card from '@/components/common/Card.vue'
import { useUserStore } from '@/stores/userStore'
import type { UserType } from '@/types'
import { onMounted, ref } from 'vue'
import {
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  Trash2,
  SquarePen,
  SquareArrowOutUpRight,
} from 'lucide-vue-next'
import { serverApi } from '@/apis'
import { formatTime } from '@/hook/format'
import ScButton from '@/components/common/ScButton.vue'
import { useToast } from 'vue-toastification'
import ScDivider from '@/components/common/ScDivider.vue'
import ScModal from '@/components/common/ScModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import ScTag from '@/components/common/ScTag.vue'
import type { ServerPostType } from '@/types/ServerPost'

const userStore = useUserStore()
const userInfo = ref<UserType>(userStore.userInfo)
const toast = useToast()

const posts = ref<ServerPostType[]>([])
const isDeletePost = ref(false)
const currentPostIndex = ref(-1)
const loading = ref(false)

const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
  count: 0,
})

const getPosts = () => {
  if (!userStore.isLogin) {
    return
  }
  loading.value = true
  serverApi
    .getCurrentUserServer({
      creatorId: userInfo.value.id,
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
      loading.value = false
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
  serverApi
    .updateServer({
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
  serverApi
    .deleteServer(item.id)
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

onMounted(() => {
  getPosts()
})
</script>
