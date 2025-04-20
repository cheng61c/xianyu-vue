import request from '@/utils/request.ts'
import type { RoleDto } from '@/types/RoleDto'
import type { RoleDisabledDto } from '@/types/RoleDisabled'

export const getRoleList = () => {
  return request.get('/role/list')
}

export const updateUserRole = (id: number, roleIds: number[]) => {
  return request.put(`/admin/user/update-roles`, {
    id: id,
    roleIds: roleIds,
  })
}
export const createRole = (dto: RoleDto) => {
  return request.post(`/role`, dto)
}
export const updateRole = (dto: RoleDto) => {
  return request.put(`/role`, dto)
}
export const roleDisabled = (dto: RoleDisabledDto) => {
  return request.post('/admin/role/disabled', dto)
}
