import type { User } from './user'

export declare interface Helo {
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
