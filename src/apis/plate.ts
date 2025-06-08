import type { PlateDisabledDto, PlateDto } from '@/types/Plate'
import request from '@/utils/request.ts'
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
  return request.put('/plate', dto)
}
/** 禁用板块 */
export const plateDisabled = (dto: PlateDisabledDto) => {
  return request.post('/admin/plate/disabled', dto)
}
/** 删除板块 */
export const plateDelete = (id: number) => {
  return request.delete(`/admin/plate/${id}`)
}

// admin apis
/** 获取所有板块列表 */
export const getPlateListAsAdmin = () => {
  return request.get('/admin/plate')
}
