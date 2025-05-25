import type { QueryCommentListDto } from '@/types/comment'
import request from '@/utils/request.ts'

export const getCommentList = (data: QueryCommentListDto) => {
  return request.get('/post-comment/list', { data })
}
