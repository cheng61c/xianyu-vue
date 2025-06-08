import request from '@/utils/request.ts'
import type { LoginDto } from '@/types/LoginDto'
import type { RegisterDto } from '@/types/RegisterDto'
import type { VerificationCode } from '@/types/VerificationCode'
import type { VerificationCodeDto } from '@/types/VerificationCodeDto'
import type { CheckDuplicateDto } from '@/types/CheckDuplicateDto'
import type { UpdatePasswordDto } from '@/types/UpdatePasswordDto'
import type {
  UpdateRoleDto,
  UpdateUserAsAdminDto,
  UpdateUserDto,
  UserDisabledDto,
  UserPostQueryDto,
  UserSelectDto,
} from '@/types'

export const login = (dto: LoginDto) => {
  return request.post('/user/login', dto)
}
export const register = (dto: RegisterDto) => {
  return request.post('/user/register', dto)
}
export const sendCode = (dto: VerificationCode) => {
  return request.post('/verification-code/send', dto)
}
export const verificationFromCode = (dto: VerificationCodeDto) => {
  return request.post('/verification-code/validate', dto)
}
export const updatePassword = (dto: UpdatePasswordDto) => {
  return request.post('/user/update-password', dto)
}
export const checkDuplicate = (dto: CheckDuplicateDto) => {
  return request({
    method: 'get',
    url: '/user/check-duplicate',
    params: dto,
  })
}
export const logout = () => {
  return request.post('/user/logout')
}
export const updateUser = (dto: UpdateUserDto) => {
  return request.put('/user/update', dto)
}

export const getUserPosts = (dto: UserPostQueryDto) => {
  return request({
    method: 'get',
    url: '/user/posts',
    params: dto,
  })
}

export const deletePost = ({ id }: { id: number }) => {
  return request.delete(`/post/${id}`)
}
export const getCurrentUser = () => {
  return request.get('/user/info')
}

export const userDisabled = (dto: UserDisabledDto) => {
  return request.post('/admin/user/disabled', dto)
}

export const getUser = (id: number) => {
  return request.get(`/user/${id}`)
}

// admin apis
export const getUserListAsAdmin = (dto: UserSelectDto) => {
  return request({
    method: 'GET',
    url: '/admin/user/list',
    params: dto,
  })
}

export const updateUserAsAdmin = (dto: UpdateUserAsAdminDto) => {
  return request.put('/admin/user/update', dto)
}

export const updateRoles = (dto: UpdateRoleDto) => {
  return request.put(`/admin/user/update-roles`, dto)
}

export const updateUserKey = (id: number) => {
  return request.put(`/admin/user/update-key/${id}`)
}
