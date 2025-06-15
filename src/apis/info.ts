import type { QueryInfoDto } from '@/types/Info'
import request from '@/utils/request.ts'

export const getInfo = (dto: QueryInfoDto) => {
  return request({
    method: 'get',
    url: '/operate-log/list',
    params: dto,
  })
}
