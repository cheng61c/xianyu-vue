import request from '@/utils/request.ts'
import type { DocumentVersion } from '@/types/DocumentVersion'
import type { GameVersionDto } from '@/types/GameVersionDto'
export const upload = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/6', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export const getVersionList = () => {
  return request.get('/version/list')
}
export const updateVersion = (id: number, dto: GameVersionDto) => {
  return request.put(`/version/${id}`, dto)
}
export const addVersion = (dto: GameVersionDto) => {
  return request.post('/version', dto)
}
export const createPostVersion = (dto: DocumentVersion) => {
  return request.post('/post-version', dto)
}

export const updatePostVersion = (dto: DocumentVersion) => {
  return request.put('/post-version', dto)
}

export const getVersion = ({ id }: { id: number }) => {
  return request.get(`/post-version/info?id=${id}`)
}

export const deleteVersion = ({ id }: { id: number }) => {
  return request.delete(`/post-version/${id}`)
}
export const reportPost = ({ dto }: { dto: Report }) => {
  return request.post(`/report`, dto)
}
