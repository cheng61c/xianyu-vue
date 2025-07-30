<template>
  <div v-if="item.type == 1" class="flex gap-2 border-b border-gray/30 p-2">
    <Avatar :src="item.send.headImg" :size="46" class="mt-1 mr-2" />
    <div>
      <div class="flex gap-2 items-end">
        <div class="font-bold text-black">{{ item.send.nickname }}</div>
        <div class="text-[15px]">
          {{ messageStore.reolyPrompt[item.commentId ? 1 : 0] }}
        </div>
      </div>

      <!-- 回复内容 -->
      <div class="pb-2 py-2">
        <span v-if="item.commentId">
          回复
          <span v-if="item.commentId" class="text-active">
            @{{ userStore.userInfo.nickname }}
          </span>
          :
        </span>

        <span>{{ item.content }}</span>
      </div>

      <!-- 被回复内容 -->
      <div
        v-if="item.commentId"
        class="text-gray text-sm border-l border-gray pl-3 my-1">
        <span>
          你: 回复 @{{ item.receive.nickname }}:
          {{ item.commentContent }}
        </span>
      </div>

      <!-- 时间 -->
      <div>
        <span class="text-gray text-sm">
          {{ item.createdAt }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/module/message/MessageStore'
import Avatar from '@/components/common/Avatar.vue'
import { useUserStore } from '@/stores/module/user/userStore'
import type { MessageType } from '@/types/MessageItem'
defineProps<{
  item: MessageType
}>()
const messageStore = useMessageStore()
const userStore = useUserStore()
</script>
