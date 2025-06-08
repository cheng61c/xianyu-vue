import type { UserRole } from './Role'

export declare interface User {
  id: number
  account: string
  password: string
  nickname: string
  signature: string
  headImg: string
  background: string
  createTime: string
  updateTime: string
  disabled?: boolean
  roles?: UserRole[]
  email?: string
}
export interface UserType {
  id: number
  account: string
  nickname: string
  exp: number
  level: number
  money: number
  regTime: string
  lastLoginTime: string
  lastLoginIp: string
  email: string
  accountType: number
  headImg: string
  signature: string
  background: string
  roles: UserRole[]
  rank: null | Array<number>
  postCount: number
  islogin: boolean
  disabled: boolean
  remark: string
}

export interface ApiUser {
  token: string
  user: UserType
}

export interface UpdateRoleDto {
  id: number
  roleIds: number[]
}

export declare interface UpdateUserDto {
  headImg?: string
  background?: string
  nickname?: string
  signature?: string
  email?: string
  password?: string
  remark?: string
}

export declare interface UpdateUserAsAdminDto {
  id: number
  headImg?: string
  background?: string
  nickname?: string
  signature?: string
  email?: string
  password?: string
  remark?: string
  disabled?: number
  rank?: string
  account?: string
  accountType?: number
  roleIds?: number[]
}

export declare interface UserDisabledDto {
  userId?: number
  disabled?: number
}

export declare interface UserPostQueryDto {
  userId?: number | string
  type?: number | string
  fileTypes?: string
  key?: string
  page?: number
  limit?: number
}

export declare interface UserSelectDto {
  nickname?: string
  email?: string
  lastLoginIp?: string
  roleId?: number
  page?: number
  limit?: number
  account?: string
  disabled?: number
  remark?: string
  id?: number
}
