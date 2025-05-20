<template>
  <div class="w-28 relative">
    <div class="sticky top-20 py-2 w-ful">
      <Card v-if="postData" class="mb-4" noPg>
        <ScButton isCol :icon="MessageCircleMore" :icon-size="24">
          {{ postData.commentCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="ThumbsUp"
          :icon-size="24"
          :class="{ ' text-error': postData.isLiked }">
          {{ postData.likeCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="ThumbsDown"
          :icon-size="24"
          :class="{ ' text-error': postData.isBaded }">
          {{ postData.badCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="Star"
          :icon-size="24"
          :class="{ ' text-orange-400': postData.isScored }">
          {{ postData.score }}
        </ScButton>
      </Card>

      <Card noPg v-if="postData && verifyPermissions([1, 2, 5])">
        <ScButton class="text-error" isCol :icon="Trash2" :icon-size="24">
        </ScButton>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import { verifyPermissions } from '@/hook/verify'
import Card from '@/components/Card.vue'
import ScButton from '@/components/ScButton.vue'

import {
  MessageCircleMore,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Star,
} from 'lucide-vue-next'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
</script>
