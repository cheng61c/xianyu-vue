import { User } from '@/type/User'

export declare interface PostComment {
  likeCount: string
  isLike: string
  id: number
  toCommentId: number
  content: string
  createdAt: string
  image: string[]
  author: User
  toAuthor: any
  children: PostComment[]
  showMessage: boolean
}
