import type { UserType } from './user'

export declare interface FengYunBang {
  id: number
  userId: number
  title: string
  headImg: string
  content: string
  status: number
  createdAt: string
  updatedAt: string
  user: UserType
}

export declare interface FengYunBangDto {
  id?: number
  userId?: number
  title: string
  headImg: string
  content: string
}
