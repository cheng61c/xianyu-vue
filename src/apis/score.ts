import request from '@/utils/request'

export const getScoreList = (id: number) => {
  return request.get(`/post/score/list?postId=${id}`)
}
export const getScoreSummary = (id: number) => {
  return request.get(`/post/score/summary?postId=${id}`)
}
export const createScore = (dto: {
  postId: number
  score: number
  content: string
}) => {
  return request.post('/post/score', dto)
}
export const scoreLike = (id: number) => {
  return request.post(`/post/score/like`, { id })
}
export const scoreBad = (id: number) => {
  return request.post(`/post/score/bad`, { id })
}
