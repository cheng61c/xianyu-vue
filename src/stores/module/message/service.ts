import { messageApi } from '@/apis'
import type { MessageType } from '@/types/MessageItem'
import { formatTime, htmlToText } from '@/utils/format'
import { useMessageStore } from './MessageStore'

const messageStore = useMessageStore()

export const getMessages = () => {
  messageApi.getMessageList().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data as MessageType[]

      messageStore.messages = data.map((item) => {
        item.content = htmlToText(item.content ?? '')
        item.createdAt = formatTime(item.createdAt)
        item.updatedAt = formatTime(item.updatedAt)
        return item
      })

      console.log('messageStore', messageStore)
    }
  })
}
