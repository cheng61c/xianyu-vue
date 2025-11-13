import type {
  QueryCommentListDto,
  QueryPostCommentsDto,
  SendCommentDto,
} from '@/types/comment'
import request from '@/utils/request.ts'

export const getCommentList = (data: QueryCommentListDto) => {
  return request.get('/post-comment/list', { data })
}

export const getPostComments = (data: QueryPostCommentsDto) => {
  return request({
    url: '/post-comment/postId',
    method: 'get',
    params: data,
  })
}

export const sendComment = (data: SendCommentDto) => {
  return request.post('/post-comment', data)
}

export const LikeComment = (data: { id: number }) => {
  return request.post('/post-comment/like', data)
}

export const deleteComment = (id: number) => {
  return request.delete('/post-comment/' + id)
}
