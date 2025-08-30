<template>
  <Card>
    <!-- 第一行，头像、标题、时间 -->
    <div
      class="flex gap-2 justify-start items-center align-middle cursor-pointer"
      @click="handleClick">
      <Avatar
        :src="post.creator.headImg"
        :alt="post.creator.nickname"
        :size="24" />
      <div>
        <div class="font-bold mr-auto">{{ post.creator.nickname }}</div>
        <div class="text-sm text-gray-content">{{ post.createdAt }}</div>
      </div>
    </div>

    <!-- 第二行，帖子部分内容 -->
    <div class="line-clamp-3 cursor-pointer" @click="handleClick">
      <div class="text-gray-content">
        <div>{{ post.title }}</div>
        <div>{{ htmlToText(post.content) }}</div>
      </div>
      <div v-if="post.images" class="flex gap-2">
        <ScImage
          v-for="img in post.images"
          :key="img"
          :src="img"
          :alt="post.title"
          class="w-28 h-28" />
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
          {{ post.plate.name }}
        </ScTag>
        <ScTag
          v-if="post.type == 2"
          size="sm"
          :icon="iconMap[post.fileType as keyof typeof typeLabelMap]"
          status="info">
          {{ typeLabelMap[post.fileType as keyof typeof typeLabelMap] }}
        </ScTag>
      </div>
    </div>

    <!-- 右侧按钮 -->
    <div class="flex gap-6 justify-between" @click="handleClick">
      <ScButton
        noPadding
        noBg
        :icon="ThumbsUp"
        :class="{
          'text-like': post.isLiked,
        }">
        {{ post.likeCount }}
      </ScButton>

      <ScButton
        noPadding
        noBg
        :icon="ThumbsDown"
        :class="{
          'text-bad': post.isBaded,
        }">
      </ScButton>

      <ScButton noPadding noBg :icon="MessageCircle">
        {{ formatNumber(post.commentCount) }}
      </ScButton>

      <ScButton noPadding noBg :icon="Eye">
        {{ formatNumber(post.views) }}
      </ScButton>
      <ScButton
        v-if="post.type == 2"
        noPadding
        noBg
        :icon="post.postVersionCount == '0' ? PackageOpen : Package">
        {{ post.postVersionCount }}
      </ScButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { defineProps } from 'vue'
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
const typeLabelMap = useTypeLabelMap()

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
</script>
