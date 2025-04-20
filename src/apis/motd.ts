import type { Motd } from '@/types/Motd'
import request from '@/utils/request.ts'

export const createMotd = (dto: Motd) => {
  return request.post('/motd', dto)
}
export const updateMotd = (dto: Motd) => {
  return request.put('/motd', dto)
}
export const getMotd = () => {
  return request.get('/motd')
}
