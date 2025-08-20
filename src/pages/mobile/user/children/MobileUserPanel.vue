<template>
  <template v-if="!loading">
    <!-- 头像 -->
    <template v-if="userStore.isLogin || !isCurrentUser">
      <MobileUserHeader
        @updateUserInfo="getCurrentUserInfo"
        :userInfo="userInfo" />
    </template>
    <!-- 概览 -->
    <Card
      v-if="userStore.isLogin && isCurrentUser"
      noCol
      class="w-full justify-evenly items-center">
      <div class="flex flex-col justify-center items-center">
        <p class="text-lg font-bold">
          {{ posts.count }}
        </p>
        <p>帖子</p>
      </div>

      <div class="h-8 w-0.5 bg-gray/40"></div>

      <div class="flex flex-col justify-center items-center">
        <p class="text-lg font-bold">
          {{ resources.count }}
        </p>
        <p>资源</p>
      </div>

      <div v-if="verifyPermissions([8, 12])" class="h-8 w-0.5 bg-gray/40"></div>

      <div
        v-if="verifyPermissions([8, 12])"
        class="flex flex-col justify-center items-center">
        <p class="text-lg font-bold">
          {{ servers.count }}
        </p>
        <p>服务器</p>
      </div>
    </Card>

    <Card
      v-if="
        (!userStore.isLogin && userInfo && !isCurrentUser) ||
        (userStore.isLogin && userInfo && !isCurrentUser)
      "
      class="stats w-full"
      noCol>
      <div
        v-html="userInfo.signature || '<p>这个人很懒，什么都没有留下</p>'"
        class="tiptap w-full"></div>
    </Card>

    <Card v-if="userStore.isLogin && isCurrentUser" class="stats w-full">
      <div class="w-full h-full flex flex-wrap justify-evenly">
        <div
          class="flex flex-col justify-center items-center flex-1"
          @click="toPage('mobileUserPost')">
          <ScrollText class="text-primary" :size="26" />
          <p>帖子</p>
        </div>

        <div
          class="flex flex-col justify-center items-center flex-1"
          @click="toPage('mobileUserResource')">
          <Package class="text-primary" :size="26" />
          <p>资源</p>
        </div>

        <div
          class="flex flex-col justify-center items-center flex-1"
          @click="toPage('mobileUserFile')">
          <File class="text-primary" :size="26" />
          <p>文件</p>
        </div>

        <div
          class="flex flex-col justify-center items-center flex-1"
          @click="toPage('mobileUserServer')">
          <Server class="text-primary" :size="26" />
          <p>服务器</p>
        </div>
      </div>
    </Card>

    <Card v-if="userStore.isLogin && isCurrentUser" class="w-full">
      <div
        class="flex justify-between px-2 py-1"
        @click="toPage('mobileUserEdit')">
        <span>编辑资料</span>
        <ChevronRight />
      </div>
      <div class="border-b border-gray/40"></div>
      <div
        class="flex justify-between px-2 py-1"
        @click="toPage('mobileAccountSecurity')">
        <span>账号安全</span>
        <ChevronRight />
      </div>
    </Card>
    <Card
      v-if="userStore.isLogin && isCurrentUser"
      noPg
      class="w-full justify-center mt-4 p-3"
      @click="
        () => {
          logout($t)
          router.push({ name: 'Home' })
        }
      ">
      <p class="text-center text-error">退出登录</p>
    </Card>
  </template>
</template>

<script setup lang="ts">
import { commentApi, serverApi, uploadApi, userApi } from '@/apis'
import { formatLink, formatNumber, formatTime } from '@/utils/format'
import { useUserStore } from '@/stores/module/user/userStore'
import type { UserType } from '@/types'
import { computed, onMounted, ref, watch } from 'vue'
import {
  ScrollText,
  ChevronRight,
  File,
  Package,
  Server,
} from 'lucide-vue-next'
import { verifyPermissions } from '@/utils/verify'
import Card from '@/components/common/Card.vue'
import MobileUserHeader from '@/components/mobile/user/MobileUserHeader.vue'
import { formatImageSrcsInHtml } from '@/utils/regex'
import { useRoute, useRouter } from 'vue-router'
import { deepClone } from '@/utils/copy'
import { logout } from '@/stores/module/user/service'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const userInfo = ref(deepClone(userStore.userInfo))
const isCurrentUser = computed(() => {
  return !route.query.userId
})
const loading = ref(true)

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

const toPage = (name: string) => {
  if (!userStore.isLogin || !isCurrentUser) {
    return
  }
  router.push({ name: name })
}

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
      loading.value = false
    })
    .catch((error) => {
      console.error('Error fetching user data:', error)
      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

const getUserInfo = (uid: number) => {
  userApi
    .getUser(uid)
    .then((response) => {
      const data = response.data.data as UserType
      data.headImg = formatLink(data.headImg)
      data.signature = formatImageSrcsInHtml(data.signature)
      userInfo.value = data
      loading.value = false
    })
    .catch((error) => {
      console.error('Error fetching user info:', error)
      loading.value = false
    })
}

onMounted(() => {
  loading.value = true
  if (route.query.userId) {
    console.log('route.query.userId', route.query.userId)
    getUserInfo(Number(route.query.userId))
    return
  }
  getCurrentUserInfo()
  getPosts()
  getResources()
  getFiles()
  getServers()
  getComments()
  loading.value = false
})

watch(
  () => route.query,
  (newVal) => {
    loading.value = true
    if (newVal.userId) {
      getUserInfo(Number(newVal.userId))
    } else {
      getCurrentUserInfo()
    }
  },
  { immediate: true }
)
</script>
