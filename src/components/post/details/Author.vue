<template>
  <Card v-if="postData">
    <h3 class="text-lg font-bold mb-2">作者</h3>
    <div class="flex gap-2 items-center">
      <Avatar
        :src="postData.author.headImg || ''"
        :alt="postData.author.nickname"
        :size="32" />
      <div class="flex flex-wrap gap-x-1">
        <span class="text-background-content font-bold">{{
          postData.author.nickname
        }}</span>
        <ScTag :size="'xs'" :bgColor="postData.author.roles[0].color">
          <span>LV</span>
          <span class="mr-1">{{ postData.author.level }}</span>
          <span>{{ postData.author.roles[0].name }}</span>
        </ScTag>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/Card.vue'
import ScTag from '@/components/ScTag.vue'
import Avatar from '@/components/Avatar.vue'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
</script>
