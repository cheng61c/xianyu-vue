import { commentApi } from '@/apis'
import type { SendCommentDto } from '@/types/comment'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const sendComment = (
  t: any,
  data: SendCommentDto,
  close?: () => void
) => {
  commentApi.sendComment(data).then((res) => {
    if (res.data.code === 200) {
      toast.success(t('t.ping-lun-cheng-gong'))
      if (close) {
        close()
      }
    }
  })
}
