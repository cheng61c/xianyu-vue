import type { UserType } from './user'

export declare interface QueryCommentListDto {
  page?: number
  limit?: number
  uid: number
  status?: number
}

export declare interface QueryPostCommentsDto {
  page?: number
  limit?: number
  postId: number
  orderType?: string // 排序方式
}

export declare interface CommentType {
  likeCount: number
  isLike: number
  id: number
  toCommentId: number
  content: string
  createdAt: string
  image: string[]
  author: UserType
  toAuthor: UserType | null
  children: CommentType[]
}

export declare interface SendCommentDto {
  postId: number // 帖子id
  commentId?: number // 评论id，发送二级评论用
  toCommentId?: number // 回复的评论id，发送三级评论用
  content: string
  image?: []
}
