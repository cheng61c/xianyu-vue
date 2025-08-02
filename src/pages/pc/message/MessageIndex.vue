<template>
  <div class="p-1 h-[calc(100vh-84px)] flex gap-4">
    <Card class="w-42 h-full">
      <div class="flex flex-col h-full gap-2">
        <div
          class="font-bold text-center flex items-center justify-center gap-1 mb-4">
          <Send :size="20" /> 消息中心
        </div>
        <div
          class="flex w-full gap-4 items-center cursor-pointer"
          :class="{
            'text-active': type == 1,
          }"
          @click="setPage(1)">
          <span class="font-bold text-xl">·</span>
          <span>回复我的</span>
        </div>

        <div
          class="flex w-full gap-4 items-center cursor-pointer"
          :class="{
            'text-active': type == 2,
          }"
          @click="setPage(2)">
          <span class="font-bold text-xl">·</span>
          <span>收到的赞</span>
        </div>
      </div>
    </Card>
    <div class="w-full flex flex-col gap-4 p-1">
      <div class="px-2 w-[calc(100%-16px)]">
        <Card class="w-full items-center" noCol>
          <span class="text-lg font-bold">{{
            type == 1 ? '回复我的' : '收到的赞'
          }}</span>

          <span>
            总计
            {{
              type == 1
                ? messageStore.replyUnread.length +
                  messageStore.replyRead.length
                : messageStore.likesUnread.length +
                  messageStore.likesRead.length
            }}
            条消息
          </span>
        </Card>
      </div>

      <div v-if="type == 1" class="w-full flex-1 overflow-y-auto p-2 space-y-2">
        <Card v-if="messageStore.replyUnread.length" class="w-full">
          <div class="text-lg font-bold border-b pb-2 border-gray/30">最新</div>
          <template v-for="item in messageStore.replyUnread" :key="item.id">
            <MessageItem v-if="item.type == type" :item="item" />
          </template>
        </Card>

        <Card v-if="messageStore.replyRead.length > 0">
          <div class="text-lg font-bold border-b pb-2 border-gray/30">累计</div>
          <template v-for="item in messageStore.replyRead" :key="item.id">
            <MessageItem v-if="item.type == type" :item="item" />
          </template>
        </Card>
      </div>

      <div v-if="type == 2" class="w-full flex-1 overflow-y-auto p-2 space-y-2">
        <Card v-if="messageStore.likesUnread.length" class="w-full">
          <div class="text-lg font-bold border-b pb-2 border-gray/30">最新</div>
          <template v-for="item in messageStore.likesUnread" :key="item.id">
            <MessageItem v-if="item.type == type" :item="item" />
          </template>
        </Card>

        <Card v-if="messageStore.likesRead.length > 0">
          <div class="text-lg font-bold border-b pb-2 border-gray/30">累计</div>
          <template v-for="item in messageStore.likesRead" :key="item.id">
            <MessageItem v-if="item.type == type" :item="item" />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import MessageItem from '@/components/pc/message/MessageItem.vue'
import { useMessageStore } from '@/stores/module/message/MessageStore'
import { getMessages, markReadAll } from '@/stores/module/message/service'
import { Send } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'

const messageStore = useMessageStore()
const type = ref(1)

const setPage = (typeId: number) => {
  type.value = typeId
  getMessages()
}

onMounted(() => {
  getMessages()
})
onUnmounted(() => {
  markReadAll()
})
</script>
