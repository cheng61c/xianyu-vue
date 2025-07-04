<template>
  <UserHeader @updateUserInfo="getCurrentUserInfo" />
  <Card class="stats max-w-6xl min-w-4xl w-full" noCol noPg>
    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userPost' })">
      <div class="stat-figure text-primary">
        <ScrollText />
      </div>
      <div class="stat-title">帖子</div>
      <div class="stat-value text-primary">{{ posts.count }}</div>
      <div class="stat-desc">总获赞 {{ posts.likeCount }}</div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userComment' })">
      <div class="stat-figure text-emerald-500">
        <MessageCircle />
      </div>
      <div class="stat-title">评论</div>
      <div class="stat-value text-emerald-500">
        {{ comments.count }}
      </div>
      <div class="stat-desc">总获赞 {{ comments.likeCount }}</div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userResource' })">
      <div class="stat-figure text-violet-500">
        <Package />
      </div>
      <div class="stat-title">资源</div>
      <div class="stat-value text-violet-500">
        {{ resources.count }}
      </div>
      <div class="stat-desc">总获赞 {{ resources.likeCount }}</div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userFile' })">
      <div class="stat-figure text-primary">
        <File />
      </div>
      <div class="stat-title">文件</div>
      <div class="stat-value text-primary">{{ files.count }}</div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userServer' })">
      <div class="stat-figure text-amber-500">
        <Server />
      </div>
      <div class="stat-title">服务器</div>
      <div class="stat-value text-amber-500">{{ servers.count }}</div>
    </div>
  </Card>

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full" noCol>
    <div
      v-html="userInfo.signature || '<p>这个人很懒，什么都没有留下</p>'"
      class="tiptap w-full"></div>
  </Card>
</template>

<script setup lang="ts">
import { commentApi, serverApi, uploadApi, userApi } from '@/apis'
import { formatLink, formatNumber, formatTime } from '@/hook/format'
import { useUserStore } from '@/stores/userStore'
import type { UserType } from '@/types'
import { onMounted, ref } from 'vue'
import {
  ScrollText,
  MessageCircle,
  File,
  Package,
  Server,
} from 'lucide-vue-next'

import Card from '@/components/common/Card.vue'
import UserHeader from '@/components/pc/user/UserHeader.vue'
import { formatImageSrcsInHtml } from '@/hook/regex'

const userStore = useUserStore()
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
  if (!userStore.isLogin) {
    return
  }
  userApi
    .getUserPosts({
      userId: userStore.userInfo.id,
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
  if (!userStore.isLogin) {
    return
  }
  userApi
    .getUserPosts({
      userId: userStore.userInfo.id,
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
  if (!userStore.isLogin) {
    return
  }
  uploadApi
    .getFilesList({
      types: '1,2,3,4,5,7',
      page: 1,
      limit: 10,
    })
    .then((response) => {
      files.value.count = response.data.data.total
      console.log(files.value)
    })
}

const getServers = () => {
  if (!userStore.isLogin) {
    return
  }
  serverApi
    .getCurrentUserServer({
      creatorId: userStore.userInfo.id,
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
  if (!userStore.isLogin) {
    return
  }
  commentApi
    .getCommentList({
      uid: userStore.userInfo.id,
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

const getCurrentUserInfo = () => {
  userApi
    .getCurrentUser()
    .then((response) => {
      const data = response.data.data as UserType
      data.headImg = formatLink(data.headImg)
      data.signature = formatImageSrcsInHtml(data.signature)
      userInfo.value = data
      console.log(response.data.data)
    })
    .catch((error) => {
      console.error('Error fetching user data:', error)
      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

onMounted(() => {
  getCurrentUserInfo()
  getPosts()
  getResources()
  getFiles()
  getServers()
  getComments()
})
</script>
