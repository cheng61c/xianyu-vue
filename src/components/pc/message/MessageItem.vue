<template>
  <div
    class="flex gap-2 border-b border-gray/30 p-2"
    v-if="[1, 2].includes(item.type)">
    <Avatar
      :src="item.send.headImg"
      :size="46"
      class="mt-1 mr-2"
      @click="$router.push(`/user/${item.send.id}`)" />
    <div @click="$router.push(`/postDetails/${item.post.id}`)">
      <!-- 用户信息行 -->
      <div class="flex gap-2 items-end">
        <div class="font-bold text-text-black">{{ item.send.nickname }}</div>
        <div class="text-[15px]">
          {{
            item.type === 1
              ? messageStore.reolyPrompt[item.commentId ? 1 : 0]
              : messageStore.likesPrompt[item.commentId ? 1 : 0]
          }}
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="pb-2 py-2">
        <template v-if="item.type === 1">
          <span v-if="item.commentId">
            回复
            <span class="text-active">@{{ userStore.userInfo.nickname }}</span>
            :
          </span>
          <span>{{ item.content }}</span>
        </template>

        <template v-else-if="item.commentId">
          <span>{{ item.commentContent }}</span>
        </template>
      </div>

      <!-- 引用内容区域 -->
      <div class="text-text-gray text-sm border-l border-gray pl-3 my-1">
        <template v-if="item.type === 1 && item.commentId">
          <span>
            你: 回复 @{{ item.send.nickname }}: {{ item.commentContent }}
          </span>
        </template>
        <template v-else-if="item.type === 2">
          <span>帖子标题: {{ item.post.title }}</span>
        </template>
      </div>

      <!-- 时间信息 -->
      <div>
        <span class="text-text-gray text-sm">{{ item.createdAt }}</span>
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
