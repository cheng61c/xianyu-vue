<template>
  <Card v-if="postData" class="justify-evenly" noPg noCol>
    <ScButton isCol :icon="MessageCircleMore" :icon-size="24">
      {{ postData.commentCount }}
    </ScButton>

    <ScButton
      isCol
      :icon="ThumbsUp"
      :icon-size="24"
      :class="{ 'text-like': postData.isLiked }"
      @click="likePost($t, postData.id)">
      {{ postData.likeCount }}
    </ScButton>

    <ScButton
      isCol
      :icon="ThumbsDown"
      :icon-size="24"
      :class="{ 'text-bad': postData.isBaded }"
      @click="badPost($t, postData.id)">
      {{ postData.badCount }}
    </ScButton>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { MessageCircleMore, ThumbsUp, ThumbsDown } from 'lucide-vue-next'
import { likePost, badPost } from '@/stores/module/post/service'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
const emit = defineEmits(['updatePost'])
</script>
