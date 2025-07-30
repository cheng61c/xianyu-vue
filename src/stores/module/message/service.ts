import { messageApi } from '@/apis'
import type { MessageType } from '@/types/MessageItem'
import { formatTime, htmlToText } from '@/utils/format'
import { useMessageStore } from './MessageStore'

const messageStore = useMessageStore()

export const getMessages = () => {
  messageApi.getUnreadMessageList().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data as MessageType[]

      messageStore.replyUnread = data
        .filter((item) => item.type === 1)
        .map((item) => {
          item.content = htmlToText(item.content ?? '')
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          return item
        })

      messageStore.likesUnread = data
        .filter((item) => item.type === 2)
        .map((item) => {
          item.content = htmlToText(item.content ?? '')
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          return item
        })

      messageStore.systemUnread = data
        .filter((item) => item.type === 3)
        .map((item) => {
          item.content = htmlToText(item.content ?? '')
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          return item
        })

      console.log('messageStore', messageStore)
    }
  })

  messageApi
    .getMessageList({
      status: 1,
    })
    .then((res) => {
      if (res.data.code === 200) {
        const data = res.data.data as MessageType[]
        messageStore.replyRead = data
          .filter((item) => item.type === 1)
          .map((item) => {
            item.content = htmlToText(item.content ?? '')
            item.createdAt = formatTime(item.createdAt)
            item.updatedAt = formatTime(item.updatedAt)
            return item
          })
      }
    })
}

export const markReadAll = () => {
  messageApi.markReadAll().then((res) => {
    if (res.data.code === 200) {
      messageStore.replyRead.push(...messageStore.replyUnread)
      messageStore.replyUnread = []
      messageStore.likesRead.push(...messageStore.likesUnread)
      messageStore.likesUnread = []
      messageStore.systemRead.push(...messageStore.systemUnread)
      messageStore.systemUnread = []
      console.log('All messages marked as read')
    }
  })
}
