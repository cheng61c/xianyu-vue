<template>
  <Card v-if="postData && postData.dependencies.length > 0">
    <h3 class="text-lg font-bold mb-2">前置</h3>
    <div
      v-for="item in postData.dependencies"
      :key="item.id"
      class="flex gap-2 items-center">
      <Avatar v-if="item.cover" :src="item.cover || ''" alt="!" :size="32" />
      <RouterLink :to="{ name: 'postDetails', params: { postId: item.id } }">
        <span class="text-blue-600">{{ item.title }}</span>
      </RouterLink>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
</script>
