<template>
  <div
    class="flex flex-col w-[100dvw] h-[100dvh] space-y-4 pb-2 overflow-y-auto">
    <div class="flex h-12 gap-2 items-center justify-between">
      <ScButton
        class="text-lg font-semibold"
        :icon="ChevronLeft"
        :iconSize="22"
        @click="$router.back()">
        {{ $t('b.xiao-xi') }}
      </ScButton>
    </div>

    <!-- 右侧内容 -->
    <div class="w-full flex flex-col gap-4 p-2">
      <Card class="items-center" noCol>
        <div
          v-for="menu in menuItems"
          class="w-full text-center cursor-pointer"
          :class="{
            'text-active': type == menu.type,
          }"
          @click="setPage(menu.type)">
          <span>{{ menu.name }}</span>
          <span class="ml-1 text-sm text-muted">({{ menu.count }})</span>
        </div>
      </Card>

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
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import Card from '@/components/common/Card.vue'
import MessageSection from '@/components/pc/message/MessageSection.vue'
import { useMessageStore } from '@/stores/module/message/MessageStore'
import { getMessages, markReadAll } from '@/stores/module/message/service'
import ScButton from '@/components/common/ScButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const messageStore = useMessageStore()
const type = ref(1)

// 菜单配置
const menuItems = computed(() => [
  {
    name: t('d.hui-fu-wo-de'),
    type: 1,
    count: messageStore.replyUnread.length + messageStore.replyRead.length,
  },
  {
    name: t('d.shou-dao-de-zan'),
    type: 2,
    count: messageStore.likesUnread.length + messageStore.likesRead.length,
  },
])
const unreadMessages = computed(() => {
  return type.value === 1 ? messageStore.replyUnread : messageStore.likesUnread
})
const readMessages = computed(() => {
  return type.value === 1 ? messageStore.replyRead : messageStore.likesRead
})

const setPage = (typeId: number) => {
  type.value = typeId
  getMessages(t)
}
onMounted(getMessages)
onUnmounted(markReadAll)
</script>
