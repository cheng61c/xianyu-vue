<template>
  <Card @click="handleClick" class="w-xl">
    <!-- 第一行，头像、标题、时间 -->
    <div class="flex gap-2 justify-between items-center">
      <div class="font-bold mr-auto">{{ post.title }}</div>
    </div>

    <!-- 第二行，帖子部分内容 -->
    <div class="text-gray-content line-clamp-2">
      {{ htmlToText(post.content) }}
    </div>

    <!-- 第三行，操作按钮 -->
    <div class="flex justify-between mt-2">
      <div class="flex gap-2 items-center">
        <Avatar
          :src="post.creator.headImg"
          :alt="post.creator.nickname"
          :size="24"
        />
        <div class="text-sm font-bold">{{ post.creator.nickname }}</div>
        <div class="text-sm text-gray-content">
          {{ formatTimeAgo(post.createdAt) }}
        </div>
      </div>
      <div class="flex gap-6">
        <ScButton noPadding noBg :icon="ThumbsUp">
          {{ post.likeCount }}
        </ScButton>

        <ScButton
          noPadding
          noBg
          :icon="ThumbsDown"
          :class="[post.isBaded ? 'active' : '']"
        >
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
import { formatTimeAgo, htmlToText, formatNumber } from '@/hook/format'
import { MessageCircle, Eye, ThumbsUp, ThumbsDown } from 'lucide-vue-next'

const props = defineProps<{
  post: Post
}>()

const handleClick = () => {
  console.log(
    'Read more clicked for:',
    props.post.title,
    'with ID:',
    props.post.id
  )
}
</script>
