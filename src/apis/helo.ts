import type { FengYunBangDto } from '@/types/FengYunBang'
import request from '@/utils/request.ts'

export const getFengYunBangAll = () => {
  return request.get('/hall-of-fame')
}

export const getFengYunBangList = () => {
  return request.get('/hall-of-fame/list')
}

export const createFengYunBang = (data: FengYunBangDto) => {
  const { id, ...rest } = data
  return request.post('/hall-of-fame', rest)
}
export const updateFengYunBang = (data: FengYunBangDto) => {
  return request.put('/hall-of-fame', data)
}
