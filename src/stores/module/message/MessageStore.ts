import type { MessageType } from '@/types/MessageItem'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    /** 消息列表 */
    messages: [] as MessageType[],
  }),
  persist: true,
})
