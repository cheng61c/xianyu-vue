<template>
  <Card v-if="postData">
    <h3 class="text-lg font-bold mb-2">{{ $t('b.zuo-zhe') }}</h3>
    <div class="flex gap-2 items-center">
      <Avatar
        :src="postData.author.headImg || ''"
        :alt="postData.author.nickname"
        :size="32" />
      <div class="flex flex-wrap gap-x-1 items-center">
        <span class="text-background-content font-bold">
          {{ postData.author.nickname }}
        </span>
        <ScRole :user="postData.author" size="sm"></ScRole>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'
import Avatar from '@/components/common/Avatar.vue'
import ScRole from '@/components/common/ScRole.vue'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
</script>
