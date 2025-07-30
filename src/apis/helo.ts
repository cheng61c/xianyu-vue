import type { FengYunBangDto, UpdateFengYunBangDto } from '@/types/FengYunBang'
import request from '@/utils/request.ts'

export const getFengYunBangAll = () => {
  return request.get('/hall-of-fame')
}

export const createFengYunBang = (data: FengYunBangDto) => {
  return request.post('/hall-of-fame', data)
}
export const updateFengYunBang = (data: UpdateFengYunBangDto) => {
  return request.put('/hall-of-fame', data)
}
