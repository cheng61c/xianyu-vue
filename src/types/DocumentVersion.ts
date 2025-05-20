import type { TFile } from '@/types/TFile'

export declare interface DocumentVersion {
  id: number
  version: string
  content: string
  postId: number
  title: string
  type: number
  fileType: number
  gameVersionIds: number[]
  createdAt: string
  updatedAt: string
  files: TFile[]
}
