import type { MessageType } from '@/types/MessageItem'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    /** 未读消息 */
    replyUnread: [] as MessageType[],

    /** 已读消息 */
    replyRead: [] as MessageType[],

    /** 收到的点赞消息 */
    likesRead: [] as MessageType[],

    /** 收到的点赞消息 */
    likesUnread: [] as MessageType[],

    /** 收到的系统消息 */
    systemUnread: [] as MessageType[],

    /** 已读的系统消息 */
    systemRead: [] as MessageType[],

    reolyPrompt: ['对我的帖子发表了评论', '回复了我的评论'],
  }),
  persist: true,
})
