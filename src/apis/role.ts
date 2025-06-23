import type { RoleDto } from '@/types/Role'
import request from '@/utils/request.ts'

export const getRoleList = () => {
  return request.get('/role/list')
}

export const updateUserRole = (id: number, roleIds: number[]) => {
  return request.put(`/admin/user/update-roles`, {
    id: id,
    roleIds: roleIds,
  })
}

export const roleDisabled = (id: number) => {
  return request.delete(`/role/${id}`)
}

//admin apis
export const getRoleListAsAdmin = () => {
  return request.get('/admin/role/list')
}

export const updateRoleAsAdmin = (dto: RoleDto) => {
  return request.put(`/admin/role/update`, dto)
}

export const createRoleAsAdmin = (dto: RoleDto) => {
  return request.post(`/role`, dto)
}
