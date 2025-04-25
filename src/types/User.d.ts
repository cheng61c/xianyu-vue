import { Role } from './Role'

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
  roles?: Role[]
  email?: string
}
