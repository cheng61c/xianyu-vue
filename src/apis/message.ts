import request from '@/utils/request.ts'

export const getUnreadMessageList = () => {
  return request.get('/notification/unread')
}

export const getMessageList = (params?: { type?: number; status?: number }) => {
  return request({
    url: '/notification/list',
    method: 'get',
    params: params,
  })
}

export const markReadAll = () => {
  return request.post('/notification/readByAll')
}
