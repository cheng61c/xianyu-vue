<template>
  <div class="flex flex-col w-full items-center gap-4 py-2">
    <Card class="stats w-5xl" noCol noPg>
      <div class="stat place-items-center">
        <div class="text-primary">
          <Avatar
            :src="formatLink(userInfo.headImg) || ''"
            :alt="userInfo.nickname"
            :size="64" />
        </div>
      </div>
    </Card>
    <Card class="stats w-5xl" noCol noPg>
      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">帖子</div>
        <div class="stat-value text-primary">{{ posts.count }}</div>
        <div class="stat-desc">总获赞 {{ posts.likeCount }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-emerald-500">
          <MessageCircle />
        </div>
        <div class="stat-title">评论</div>
        <div class="stat-value text-emerald-500">
          {{ comments.count }}
        </div>
        <div class="stat-desc">总获赞 {{ comments.likeCount }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-violet-500">
          <Package />
        </div>
        <div class="stat-title">资源</div>
        <div class="stat-value text-violet-500">
          {{ resources.count }}
        </div>
        <div class="stat-desc">总获赞 {{ resources.likeCount }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <File />
        </div>
        <div class="stat-title">文件</div>
        <div class="stat-value text-primary">{{ files.count }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-amber-500">
          <Server />
        </div>
        <div class="stat-title">服务器</div>
        <div class="stat-value text-amber-500">{{ servers.count }}</div>
      </div>
    </Card>

    <Card class="stats w-5xl" noCol>
      <div
        v-html="userInfo.signature || '<p>这个人很懒，什么都没有留下</p>'"
        class="tiptap w-full"></div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import {
  ScrollText,
  MessageCircle,
  File,
  Package,
  Server,
} from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import type { UserType } from '@/types'
import { commentApi, serverApi, uploadApi, userApi } from '@/apis'
import { formatLink, formatNumber, formatTime } from '@/hook/format'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const route = useRoute()

/** 他人视角 */
const isUserId = ref(false)
const userInfo = ref<UserType>(userStore.userInfo)

// 个人信息
const posts = ref({
  data: [],
  likeCount: '0',
  count: 0,
})
const comments = ref({
  data: [],
  likeCount: '0',
  count: 0,
})
const resources = ref({
  data: [],
  likeCount: '0',
  count: 0,
})
const files = ref({
  data: [],
  count: 0,
})
const servers = ref({
  data: [],
  count: 0,
})

const getPosts = () => {
  userApi
    .getUserPosts({
      userId: isUserId.value
        ? (route.params.userId as string)
        : userStore.userInfo.id,
      type: 1,
    })
    .then((response) => {
      posts.value.likeCount = formatNumber(
        response.data.data.list.reduce(
          (acc: number, item: any) => acc + item.likeCount,
          0
        )
      )
      posts.value.data = response.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
      })
      posts.value.count = response.data.data.count
    })
    .catch((error) => {
      console.error('Error fetching posts:', error)
    })
}

const getResources = () => {
  userApi
    .getUserPosts({
      userId: isUserId.value
        ? (route.params.userId as string)
        : userStore.userInfo.id,
      type: 2,
    })
    .then((response) => {
      resources.value.likeCount = formatNumber(
        response.data.data.list.reduce(
          (acc: number, item: any) => acc + item.likeCount,
          0
        )
      )
      resources.value.data = response.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
      })
      resources.value.count = response.data.data.count
    })
    .catch((error) => {
      console.error('Error fetching resources:', error)
    })
}

const getFiles = () => {
  uploadApi.getFilesList().then((response) => {
    files.value.data = response.data.data.map((item: any) => {
      item.createdAt = formatTime(item.createdAt)
    })
    files.value.count = response.data.data.length
    console.log(files.value)
  })
}

const getServers = () => {
  serverApi
    .getServer({
      creatorId: isUserId.value ? +route.params.userId : userStore.userInfo.id,
      page: 1,
      limit: 10,
    })
    .then((response) => {
      servers.value.data = response.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
      })
      servers.value.count = response.data.data.count
    })
}

const getComments = () => {
  commentApi
    .getCommentList({
      uid: isUserId.value ? +route.params.userId : userStore.userInfo.id,
      page: 1,
      limit: 10,
    })
    .then((response) => {
      comments.value.likeCount = formatNumber(
        response.data.data.list.reduce(
          (acc: number, item: any) => acc + item.likeCount,
          0
        )
      )
      comments.value.data = response.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
      })
      comments.value.count = response.data.data.count
    })
    .catch((error) => {
      console.error('Error fetching comments:', error)
    })
}

onMounted(() => {
  if (route.params.userId) {
    isUserId.value = true
    userApi
      .getCurrentUser()
      .then((response) => {
        userInfo.value = response.data.data as UserType
        console.log(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  } else {
    isUserId.value = false
  }
  getPosts()
  getResources()
  getFiles()
  getServers()
})
</script>
