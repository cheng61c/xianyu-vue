import type { DisableVersionDto, PutVersionDto } from '@/types/version'
import request from '@/utils/request.ts'

export const getVersion = () => {
  return request.get('/version/list')
}

export const putVersion = (id: number, dto: PutVersionDto) => {
  return request.put('/version/' + id, dto)
}

export const delVersion = (id: number) => {
  return request.delete('/version/' + id)
}

export const addVersion = (dto: PutVersionDto) => {
  return request.post('/version', dto)
}

export const disableVersion = (dto: DisableVersionDto) => {
  return request.post('/version', dto)
}
// admin apis

export const getVersionAsAdmin = () => {
  return request.get('/admin/version/list')
}
