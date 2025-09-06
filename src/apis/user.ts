import request from '@/utils/request.ts'
import type { LoginDto } from '@/types/LoginDto'
import type { RegisterBotDto, RegisterDto } from '@/types/RegisterDto'
import type {
  VerificationCode,
  VerificationCodeDto,
} from '@/types/VerificationCode'
import type { UpdatePasswordDto } from '@/types/UpdatePasswordDto'
import type {
  UpdateRoleDto,
  UpdateUserAsAdminDto,
  UpdateUserDto,
  UserDisabledDto,
  UserPostQueryDto,
  UserSelectDto,
} from '@/types'
import type { CheckDuplicateDto } from '@/types/CheckDuplicateDto'

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

export const updateUserKey = () => {
  return request.put(`/user/update-key`)
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

export const userDisabledAsAdmin = (dto: UserDisabledDto) => {
  return request.post('/admin/user/disabled', dto)
}

export const updateUserAsAdmin = (dto: UpdateUserAsAdminDto) => {
  return request.put('/admin/user/update', dto)
}

export const updateRoles = (dto: UpdateRoleDto) => {
  return request.put(`/admin/user/update-roles`, dto)
}

export const updateUserKeyAsAdmin = (id: number) => {
  return request.put(`/admin/user/update-key/${id}`)
}

export const registerAsAdmin = (dto: RegisterBotDto) => {
  return request.post('/user/register-bot', dto)
}
