import request from '@/utils/request'

export const ping = (url: string) => {
  return request.post('/server-post/test/ping', { url })
}
