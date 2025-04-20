import type { TFile } from '@/types/TFile'

export declare interface DocumentVersion {
  version: string
  title: string
  files: (number | TFile)[]
  content?: string
  postId: number
  id?: number
  gameVersionIds: number[]
}
