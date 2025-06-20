import type { MotdDto } from '@/types/Motd'
import request from '@/utils/request.ts'

export const createMotd = (dto: MotdDto) => {
  return request.post('/motd', dto)
}
export const updateMotd = (dto: MotdDto) => {
  return request.put('/motd', dto)
}
export const getMotd = () => {
  return request.get('/motd')
}

// admin apis
export const getMotdAsAdmin = () => {
  return request.get('/admin/motd')
}
