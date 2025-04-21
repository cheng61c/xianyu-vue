import { Plate } from '@/type/Plate'
import { DocumentVersion } from '@/type/DocumentVersion'
import { User } from '@/type/User'
interface Creator {
  id: number
  nickname: string
}
export declare interface Post {
  id: number
  title: string
  content: string
  views: number
  cover: string
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
  creator: Creator
  dependencies: number[]
  plate: Plate
  postVersions: DocumentVersion
  author: User
}
