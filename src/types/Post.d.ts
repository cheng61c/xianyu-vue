import { Plate } from '@/types/Plate'
import { DocumentVersion } from '@/types/DocumentVersion'
import { UserType } from './user'
interface Creator {
  id: number
  nickname: string
  headImg: string
}
export declare interface Post {
  id: number
  title: string
  content: string
  views: string
  cover: string
  images?: string[]
  visible: number
  creatorId: number
  plateId: number
  tags?: any[]
  type: number
  fileType: number
  downloadCount: number
  createdAt: string
  updatedAt: string
  isLiked: boolean
  likeCount: string
  isBaded: boolean
  badCount: string
  isCollected: boolean
  postVersionCount: string
  commentCount: string
  heat: string
  score: string
  isScored: boolean
  creator: Creator
  dependencies: {
    id: number
    title: string
    cover: string
    creator: UserType
  }[]
  plate: Plate
  postVersions: DocumentVersion[]
  author: UserType
  status: number // 1 正常 2 禁用 3 完成验证
  top: number // 0 不置顶 1 置顶
  disabled: number // 0 正常 1 禁用
  remark: string // 管理员备注
}

export declare interface SelectedPost {
  id: number
  title: string
  creator: { id: number; nickname: string }
}

export declare interface PostCreateVersionDto {
  id?: number // 版本ID
  title: string
  version: string
  content: string
  postId: number
  files: number[]
  gameVersionIds: number[]
}

export declare interface PostQueryDto {
  type?: number // 帖子类型
  orderType?: number // 排序方式
  top?: number // 是否置顶
  status?: number // 帖子状态
  plateId?: number // 板块ID
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  title?: string // 帖子标题
  content?: string // 帖子内容
  creatorId?: string // 用户ID
  id?: string // 帖子ID
  page?: number // 当前页码
  limit?: number // 每页数量
}
