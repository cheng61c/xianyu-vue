<template>
  <Card>
    <!-- 第一行，头像、标题、时间 -->
    <div
      class="flex gap-2 justify-between items-center align-middle cursor-pointer"
      @click="handleClick">
      <Avatar
        :src="post.creator.headImg"
        :alt="post.creator.nickname"
        :size="24"
        @click.stop="toUserPage(post.creator.id)" />
      <div class="font-bold mr-auto">{{ post.title }}</div>

      <div class="text-sm text-gray-content">
        {{ formatTime(post.createdAt) }}
      </div>
    </div>

    <!-- 第二行，帖子部分内容 -->
    <div
      class="text-gray-content line-clamp-2 cursor-pointer"
      @click="handleClick">
      {{ htmlToText(post.content) }}
    </div>

    <!-- 第三行，操作按钮 -->
    <div class="flex justify-between mt-2">
      <div class="flex gap-2 items-center cursor-pointer">
        <ScTag size="sm" :icon="SquareChartGantt" status="info">
          {{ post.plate.name }}
        </ScTag>
      </div>
      <div class="flex gap-6">
        <ScButton
          noPadding
          noBg
          :icon="ThumbsUp"
          :activationColor="props.post.isLiked ? 'text-active' : ''"
          @click.stop="clickGood(post.id)"
          :class="[post.isLiked ? 'active' : '']">
          {{ post.likeCount }}
        </ScButton>

        <ScButton
          noPadding
          noBg
          :icon="ThumbsDown"
          :activationColor="props.post.isBaded ? 'text-active' : ''"
          :class="[post.isBaded ? 'active' : '']"
          @click.stop="clickBad(post.id)">
        </ScButton>

        <ScButton noPadding noBg :icon="MessageCircle">
          {{ formatNumber(post.commentCount) }}
        </ScButton>

        <ScButton noPadding noBg :icon="Eye">
          {{ formatNumber(post.postVersionCount) }}
        </ScButton>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import Avatar from '@/components/Avatar.vue'
import Card from '@/components/Card.vue'
import ScButton from '@/components/ScButton.vue'
import { defineProps } from 'vue'
import { formatTime, htmlToText, formatNumber } from '@/hook/format'
import {
  MessageCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  SquareChartGantt,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import ScTag from '../ScTag.vue'

const router = useRouter()

const props = defineProps<{
  post: Post
}>()

const handleClick = () => {
  router.push({
    name: 'postDetails',
    params: { postId: props.post.id },
  })
  console.log(
    'Read more clicked for:',
    props.post.title,
    'with ID:',
    props.post.id
  )
}
const toUserPage = (userId: number) => {
  console.log('Redirecting to user page with ID:', userId)
  // Implement your redirection logic here
}

const clickGood = (postId: number) => {
  console.log('Like clicked for post with ID:', postId)
  // Implement your like logic here
}

const clickBad = (postId: number) => {
  console.log('Dislike clicked for post with ID:', postId)
  // Implement your dislike logic here
}
</script>
