<template>
  <div class="p-1 h-[calc(100vh-84px)] flex gap-4">
    <!-- 左侧菜单 -->
    <Card class="w-42 h-full">
      <div class="flex flex-col h-full gap-2">
        <div
          class="font-bold text-center flex items-center justify-center gap-1 mb-4">
          <Send :size="20" /> {{ $t('d.xiao-xi-zhong-xin') }}
        </div>
        <div
          v-for="menuI in menuItems"
          class="flex w-full gap-4 items-center cursor-pointer"
          :class="{
            'text-active': type == menuI.type,
          }"
          @click="setPage(menuI.type)">
          <span class="font-bold text-xl">·</span>
          <span>{{ menuI.label }}</span>
        </div>
      </div>
    </Card>

    <!-- 右侧内容 -->
    <div class="w-full flex flex-col gap-4 p-1">
      <Card class="w-[calc(100%-16px)]" noCol>
        <span class="text-lg font-bold">{{ activeMenu.label }}</span>
        <span>{{ $t('d.zong-ji-totalcount-tiao-xiao-xi', [totalCount]) }}</span>
      </Card>

      <div class="w-full flex-1 overflow-y-auto p-2 space-y-2">
        <MessageSection
          v-if="unreadMessages.length"
          :title="$t('b.zui-xin')"
          :messages="unreadMessages" />
        <MessageSection
          v-if="readMessages.length"
          :title="$t('t.lei-ji')"
          :messages="readMessages" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Send } from 'lucide-vue-next'
import Card from '@/components/common/Card.vue'
import MessageSection from '@/components/pc/message/MessageSection.vue'
import { useMessageStore } from '@/stores/module/message/MessageStore'
import { getMessages, markReadAll } from '@/stores/module/message/service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const messageStore = useMessageStore()
const type = ref(1)

// 菜单配置
const menuItems = [
  { type: 1, label: t('d.hui-fu-wo-de') },
  { type: 2, label: t('d.shou-dao-de-zan') },
]

// 计算属性
const activeMenu = computed(
  () => menuItems.find((item) => item.type === type.value) || menuItems[0]
)
const totalCount = computed(() => {
  return type.value === 1
    ? messageStore.replyUnread.length + messageStore.replyRead.length
    : messageStore.likesUnread.length + messageStore.likesRead.length
})
const unreadMessages = computed(() => {
  return type.value === 1 ? messageStore.replyUnread : messageStore.likesUnread
})
const readMessages = computed(() => {
  return type.value === 1 ? messageStore.replyRead : messageStore.likesRead
})

// 方法
const setPage = (typeId: number) => {
  type.value = typeId
  getMessages()
}

// 生命周期
onMounted(getMessages)
onUnmounted(markReadAll)
</script>
