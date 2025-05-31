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
  score: string
  isScored: boolean
  creator: Creator
  dependencies: { id: number; title: string; cover: string }[]
  plate: Plate
  postVersions: DocumentVersion[]
  author: UserType
}

export declare interface SelectedPost {
  id: number
  title: string
  creator: { id: number; nickname: string }
}

export declare interface PostCreateVersionDto {
  title: string
  version: string
  content: string
  postId: number
  files: number[]
  gameVersionIds: number[]
}
