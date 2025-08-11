import request from '@/utils/request.ts'

export const getPanel = () => {
  return request.get('/admin/panel')
}
