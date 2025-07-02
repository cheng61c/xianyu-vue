import request from '@/utils/request.ts'
import type {
  QueryServerPostList,
  ServerPost,
  ServerPostListQueryDto,
  ServerPostListUpdateDto,
} from '@/types/ServerPost'
export const getServerList = () => {
  return request.get('/server-post')
}
export const createServer = (data: ServerPost) => {
  return request.post(`/server-post`, data)
}
export const updateServer = (data: ServerPostListUpdateDto) => {
  return request.put(`/server-post`, data)
}
export const deleteServer = (data: number) => {
  return request.delete(`/server-post/${data}`)
}
export const getServer = (data: QueryServerPostList) => {
  return request.get(`/server-post/list`, data)
}

export const getCurrentUserServer = (data: QueryServerPostList) => {
  return request.get(`/user/server-posts`, data)
}

export const deleteServerAsAdmin = (data: { id: number; disabled: number }) => {
  return request.delete(`/server-post/${data.id}`, {
    data: { disabled: data.disabled },
  })
}

// admin apis
export const getServerListAsAdmin = (dto: ServerPostListQueryDto) => {
  return request({
    method: 'GET',
    url: '/admin/server-post/list',
    params: dto,
  })
}

export const updateServerPostAsAdmin = (data: ServerPostListUpdateDto) => {
  return request.put(`/admin/server-post/update`, data)
}
