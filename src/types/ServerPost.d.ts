export declare interface ServerPost {
  title: string
  id?: number
  url: string
  versionId: number
  updatedAt?: string
}

export declare interface QueryServerPostList {
  creatorId: number
  key?: string
  url?: string
  versionId?: number
  page?: number
  limit?: number
  level?: number
  createdAt?: string
  updatedAt?: string
}
