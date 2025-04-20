import request from '@/utils/request.ts'
import type { PlateDto } from '@/types/PlateDto'
import type { PlateDisabledDto } from '@/types/PlateDisabled'
/** 获取板块列表 */
export const getPlateList = () => {
  return request.get('/plate/list')
}
/** 创建板块 */
export const createPlate = (dto: PlateDto) => {
  return request.post('/plate', dto)
}
/** 更新板块 */
export const updatePlate = (dto: PlateDto) => {
  return request.post('/plate', dto)
}
/** 禁用板块 */
export const plateDisabled = (dto: PlateDisabledDto) => {
  return request.post('/admin/plate/disabled', dto)
}
/** 删除板块 */
export const plateDelete = (id: number) => {
  return request.delete(`/admin/plate/${id}`)
}
