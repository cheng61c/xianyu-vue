import request from '@/utils/request.ts'

export const getBili = (url: string) => {
  return request.post(`/post/bibz`, { url })
}
