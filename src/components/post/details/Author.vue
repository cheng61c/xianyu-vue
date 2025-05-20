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
        <ScTag
          v-for="role in postData.author.roles"
          :size="'xs'"
          :bgColor="role.color">
          {{ role.name }}{{ role.id }}
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
