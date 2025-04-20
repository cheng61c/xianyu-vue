import request from '@/utils/request.ts'
import type { HeloListQueryDto } from '@/types/HeloListQueryDto'
import type { HeloDto } from '@/types/HeloDto'
export const getHeloList = (dto: HeloListQueryDto) => {
  return request({
    url: '/hall-of-fame',
    method: 'GET',
    params: dto,
  })
}

export const createHelo = (data: HeloDto) => {
  return request.post('/hall-of-fame', data)
}
export const updateHelo = (data: HeloDto) => {
  return request.put('/hall-of-fame', data)
}
