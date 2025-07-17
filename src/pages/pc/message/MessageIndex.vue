<template>
  <div class="p-1 h-[calc(100vh-84px)] flex gap-4">
    <Card class="w-38 h-full">
      <div class="flex flex-col h-full gap-1">
        <div
          class="font-bold text-center flex items-center justify-center gap-1 mb-4">
          <Send :size="20" /> 消息中心
        </div>
        <div class="w-full text-active">· 回复我的</div>
        <div class="w-full">· 收到的赞</div>
      </div>
    </Card>
    <div class="w-full flex flex-col gap-4">
      <Card class="w-full">
        <span class="text-lg font-bold">回复我的</span>
      </Card>

      <Card class="w-full flex-1 overflow-y-auto">
        <template v-for="(item, index) in messageStore.messages" :key="index">
          <div v-if="item.type == 1" class="flex gap-2">
            <Avatar :src="item.send.headImg" />
            <div>
              <div class="flex gap-2 items-center">
                <div>{{ item.send.nickname }}</div>
                <div class="text-gray-500 text-sm">
                  {{ reolyPrompt[item.commentId ? 1 : 0] }}
                </div>
              </div>

              <!-- 回复内容 -->
              <div>
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
                class="text-gray text-sm border-l border-gray pl-2 mt-1">
                <span>
                  <span>你:回复</span>
                  <span>@{{ item.receive.nickname }}:</span>
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
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import { useMessageStore } from '@/stores/module/message/MessageStore'
import { getMessages } from '@/stores/module/message/service'
import { useUserStore } from '@/stores/module/user/userStore'
import { Send } from 'lucide-vue-next'
import { onMounted } from 'vue'

const messageStore = useMessageStore()
const userStore = useUserStore()

const reolyPrompt = ['对我的帖子发表了评论', '回复了我的评论']

onMounted(() => {
  getMessages()
})
</script>
