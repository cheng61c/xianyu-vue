import request from '@/utils/request'

export const uploadFile = (file: File, type: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/' + type, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
