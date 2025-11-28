<template>
  <Card>
    <!-- 第一行，头像、标题、时间 -->
    <div
      class="flex gap-2 justify-between items-center align-middle cursor-pointer"
      @click="handleClick">
      <div class="flex gap-2 items-center">
        <Avatar
          :src="localPost.creator.headImg"
          :alt="localPost.creator.nickname"
          :size="24" />
        <span class="">{{ post.creator.nickname }}</span>
        <ScRole
          v-if="post.creator && post.creator.roles"
          :user="post.creator"
          size="sm"></ScRole>
      </div>

      <div class="text-sm text-gray-content">
        {{ localPost.createdAt }}
      </div>
    </div>

    <!-- 第二行，帖子部分内容 -->
    <div class="line-clamp-2 cursor-pointer" @click="handleClick">
      <div v-if="localPost.images" class="flex gap-2">
        <ScImage
          v-for="img in localPost.images"
          :key="img"
          :src="img"
          :alt="localPost.title"
          class="w-28 h-28" />
      </div>
      <div class="font-bold">{{ localPost.title }}</div>
      <div class="text-gray-content">
        {{ htmlToText(localPost.content) }}
      </div>
    </div>

    <!-- 第三行，操作按钮 -->
    <div class="flex justify-between mt-2">
      <!-- 左侧标签 -->
      <div class="flex gap-2 items-center cursor-pointer">
        <ScTag
          size="sm"
          :icon="SquareChartGantt"
          status="info"
          @click="
            $router.push({
              params: { plateId: post.plate.id },
            })
          ">
          {{ localPost.plate.name }}
        </ScTag>
        <ScTag
          v-if="localPost.type == 2"
          size="sm"
          :icon="iconMap[localPost.fileType as keyof typeof typeLabelMap]"
          status="info">
          {{ typeLabelMap[localPost.fileType as keyof typeof typeLabelMap] }}
        </ScTag>
      </div>
      <!-- 右侧按钮 -->
      <div class="flex gap-6" @click="handleClick">
        <ScButton
          v-if="localPost.type == 2"
          noPadding
          noBg
          :icon="localPost.postVersionCount == '0' ? PackageOpen : Package">
          {{ localPost.postVersionCount }}
        </ScButton>

        <ScButton
          noPadding
          noBg
          :icon="ThumbsUp"
          :class="{
            'text-like': localPost.isLiked,
          }"
          @click.stop="like(localPost.id)">
          {{ localPost.likeCount }}
        </ScButton>

        <ScButton
          noPadding
          noBg
          :icon="ThumbsDown"
          :class="{
            'text-bad': localPost.isBaded,
          }"
          @click.stop="bad(localPost.id)">
          {{ localPost.badCount }}
        </ScButton>

        <ScButton noPadding noBg :icon="MessageCircle">
          {{ localPost.commentCount }}
        </ScButton>

        <ScButton noPadding noBg :icon="Eye">
          {{ localPost.views }}
        </ScButton>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { defineProps, reactive, watch } from 'vue'
import { htmlToText, formatNumber } from '@/utils/format'
import {
  MessageCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  SquareChartGantt,
  Package,
  PackageOpen,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import ScTag from '@/components/common/ScTag.vue'
import ScImage from '@/components/common/ScImage.vue'
import { iconMap, useTypeLabelMap } from '@/utils/fileType'
import { likePost, badPost } from '@/stores/module/post/service'
import { useI18n } from 'vue-i18n'
import ScRole from '@/components/common/ScRole.vue'

const router = useRouter()
const { t } = useI18n()
const typeLabelMap = useTypeLabelMap(t)
const props = defineProps<{
  post: Post
}>()
const localPost = reactive({ ...props.post })

// 监听 post 变化时同步到本地副本
watch(
  () => props.post,
  (newVal) => {
    Object.assign(localPost, newVal)
  }
)

const handleClick = () => {
  router.push({
    name: 'postDetails',
    params: { postId: localPost.id },
  })
  console.log(
    'Read more clicked for:',
    localPost.title,
    'with ID:',
    localPost.id
  )
}

const like = (id: number) => {
  likePost(t, id, () => {
    localPost.isLiked = !localPost.isLiked
    localPost.likeCount = formatNumber(
      Number(localPost.likeCount) + (localPost.isLiked ? 1 : -1)
    )
  })
}

const bad = (id: number) => {
  badPost(t, id, () => {
    localPost.isBaded = !localPost.isBaded
    localPost.badCount = formatNumber(
      Number(localPost.badCount) + (localPost.isBaded ? 1 : -1)
    )
  })
}
</script>
