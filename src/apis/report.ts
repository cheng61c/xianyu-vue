import type { ReportCreateDto, ReportDto, ReporUpdateDto } from '@/types/Report'
import request from '@/utils/request.ts'
/** 获取举报列表 */
export const getReportList = (dto: ReportDto) => {
  return request({
    method: 'get',
    url: '/report',
    params: dto,
  })
}
/** 创建举报 */
export const createReport = (dto: ReportCreateDto) => {
  return request.post('/report', dto)
}
/** 更新 */
export const updateReport = (dto: ReporUpdateDto) => {
  return request.put('/report', dto)
}
