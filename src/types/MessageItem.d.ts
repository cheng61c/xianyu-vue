import type { UserType } from './user'

export declare interface MessageType {
  id: number
  receiveId: number
  type: number
  sendId: number
  postId: number
  commentId: number
  commentContent: string
  content: string
  readAt: number
  createdAt: string
  updatedAt: string
  send: UserType
  receive: UserType
  post: {
    id: number
    title: string
  }
}
