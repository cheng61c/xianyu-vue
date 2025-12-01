<template>
  <template v-if="userStore.isLogin || !isCurrentUser">
    <UserHeader
      @updateUserInfo="getCurrentUserInfo"
      :isEdit="isCurrentUser"
      :userInfo="userInfo" />
  </template>

  <Card
    v-if="isCurrentUser"
    class="stats max-w-6xl min-w-4xl w-full"
    noCol
    noPg>
    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userPost' })">
      <div class="stat-figure text-primary">
        <ScrollText />
      </div>
      <div class="stat-title">{{ $t('nav.tie-zi') }}</div>
      <div class="stat-value text-primary">{{ posts.count }}</div>
      <div class="stat-desc">
        {{ $t('other.zong-huo-zan') }} <span>{{ posts.likeCount }}</span>
      </div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userComment' })">
      <div class="stat-figure text-emerald-500">
        <MessageCircle />
      </div>
      <div class="stat-title">{{ $t('nav.ping-lun') }}</div>
      <div class="stat-value text-emerald-500">
        {{ comments.count }}
      </div>
      <div class="stat-desc">
        {{ $t('other.zong-huo-zan') }} <span>{{ comments.likeCount }}</span>
      </div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userResource' })">
      <div class="stat-figure text-violet-500">
        <Package />
      </div>
      <div class="stat-title">{{ $t('nav.zi-yuan') }}</div>
      <div class="stat-value text-violet-500">
        {{ resources.count }}
      </div>
      <div class="stat-desc">
        {{ $t('other.zong-huo-zan') }} <span>{{ resources.likeCount }}</span>
      </div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userFile' })">
      <div class="stat-figure text-primary">
        <File />
      </div>
      <div class="stat-title">{{ $t('nav.wen-jian') }}</div>
      <div class="stat-value text-primary">{{ files.count }}</div>
    </div>

    <div
      class="stat cursor-pointer"
      @click="$router.push({ name: 'userServer' })">
      <div class="stat-figure text-amber-500">
        <Server />
      </div>
      <div class="stat-title">{{ $t('nav.fu-wu-qi') }}</div>
      <div class="stat-value text-amber-500">{{ servers.count }}</div>
    </div>
  </Card>

  <Card
    v-if="
      (!userStore.isLogin && userInfo && !isCurrentUser) ||
      (userStore.isLogin && userInfo && !isCurrentUser)
    "
    class="stats max-w-6xl min-w-4xl w-full"
    noCol>
    <div
      v-html="userInfo.signature || '<p>这个人很懒，什么都没有留下</p>'"
      class="tiptap w-full"></div>
  </Card>
</template>

<script setup lang="ts">
import { formatLink, formatNumber, formatTimeOrAgo } from '@/utils/format'
import { useUserStore } from '@/stores/module/user/userStore'
import type { UserType } from '@/types'
import { computed, onMounted, ref, watch } from 'vue'
import {
  ScrollText,
  MessageCircle,
  File,
  Package,
  Server,
} from 'lucide-vue-next'

import Card from '@/components/common/Card.vue'
import UserHeader from '@/components/pc/user/UserHeader.vue'
import { getUserPanel } from '@/stores/module/user/service'
import { useRoute } from 'vue-router'
import { userApi } from '@/apis'
import { formatImageSrcsInHtml } from '@/utils/regex'
import { useI18n } from 'vue-i18n'
import { deepClone } from '@/utils/copy'

const { t } = useI18n()
const userStore = useUserStore()
const userInfo = ref<UserType>(deepClone(userStore.userInfo))
const route = useRoute()
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

const getPanel = async (userId: number) => {
  const panel = await getUserPanel(userId)

  // 头像
  panel.user.headImg = formatLink(panel.user.headImg)
  userInfo.value = panel.user

  // 帖子
  posts.value.likeCount = formatNumber(
    posts.value.data.reduce((acc: number, item: any) => acc + item.likeCount, 0)
  )
  posts.value.data = panel.posts.list.map((item: any) => {
    item.createdAt = formatTimeOrAgo(item.createdAt, t)
  })
  posts.value.count = panel.posts.count

  // 资源
  resources.value.likeCount = formatNumber(
    panel.resources.list.reduce(
      (acc: number, item: any) => acc + item.likeCount,
      0
    )
  )
  resources.value.data = panel.resources.list.map((item: any) => {
    item.createdAt = formatTimeOrAgo(item.createdAt, t)
  })
  resources.value.count = panel.resources.count

  // 文件
  files.value.count = panel.files.count

  // 服务器
  servers.value.data = panel.servers.list.map((item: any) => {
    item.createdAt = formatTimeOrAgo(item.createdAt, t)
  })
  servers.value.count = panel.servers.count

  // 评论
  comments.value.data = panel.comments.list.map((item: any) => {
    item.createdAt = formatTimeOrAgo(item.createdAt, t)
  })
  comments.value.count = panel.comments.count
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
  } else {
    getCurrentUserInfo()
    getPanel(userStore.userInfo.id)
  }
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
