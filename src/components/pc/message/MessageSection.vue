<template>
  <Card class="w-full">
    <div class="text-lg font-bold border-b pb-2 border-gray/30">
      {{ title }}
    </div>
    <template v-for="item in messages" :key="item.id">
      <MessageItem :item="item" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import MessageItem from '@/components/pc/message/MessageItem.vue'
import type { MessageType } from '@/types/MessageItem'

defineProps({
  title: {
    type: String,
    required: true,
  },
  messages: {
    type: Array as () => MessageType[],
    required: true,
  },
})
</script>
