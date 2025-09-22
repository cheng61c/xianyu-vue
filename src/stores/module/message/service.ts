import { messageApi } from '@/apis'
import type { MessageType } from '@/types/MessageItem'
import { formatTimeOrAgo, htmlToText } from '@/utils/format'
import { useMessageStore } from './MessageStore'
import { useI18n } from 'vue-i18n'

const messageStore = useMessageStore()

export const getMessages = () => {
  const { t } = useI18n()
  messageApi.getUnreadMessageList().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data as MessageType[]

      messageStore.replyUnread = data
        .filter((item) => item.type === 1)
        .map((item) => {
          item.content = htmlToText(item.content ?? '')
          item.createdAt = formatTimeOrAgo(item.createdAt, t)
          item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
          return item
        })

      messageStore.likesUnread = data
        .filter((item) => item.type === 2)
        .map((item) => {
          item.content = htmlToText(item.content ?? '')
          item.createdAt = formatTimeOrAgo(item.createdAt, t)
          item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
          return item
        })

      messageStore.systemUnread = data
        .filter((item) => item.type === 3)
        .map((item) => {
          item.content = htmlToText(item.content ?? '')
          item.createdAt = formatTimeOrAgo(item.createdAt, t)
          item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
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
            item.createdAt = formatTimeOrAgo(item.createdAt, t)
            item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
            return item
          })

        messageStore.likesRead = data
          .filter((item) => item.type === 2)
          .map((item) => {
            item.content = htmlToText(item.content ?? '')
            item.createdAt = formatTimeOrAgo(item.createdAt, t)
            item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
            return item
          })

        messageStore.systemRead = data
          .filter((item) => item.type === 3)
          .map((item) => {
            item.content = htmlToText(item.content ?? '')
            item.createdAt = formatTimeOrAgo(item.createdAt, t)
            item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
            return item
          })

        console.log('messageStore after read', messageStore)
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
