import type { User } from './user'

export declare interface FengYunBang {
  id: number
  userId: number
  title: string
  headImg: string
  content: string
  status: number
  createdAt: string
  updatedAt: string
  user: User
}

export declare interface FengYunBangDto {
  userId?: number
  title: string
  headImg: string
  content: string
}

export declare interface UpdateFengYunBangDto {
  id: number
  userId?: number
  title: string
  headImg: string
  content: string
}
