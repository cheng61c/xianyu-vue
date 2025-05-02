import type { UserType } from '@/types/user'

export declare interface PostComment {
  likeCount: string
  isLike: string
  id: number
  toCommentId: number
  content: string
  createdAt: string
  image: string[]
  author: UserType
  toAuthor: UserType
  children: PostComment[]
  showMessage: boolean
}
