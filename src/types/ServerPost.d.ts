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

export declare interface ServerPostListQueryDto {
  page?: number
  limit?: number
  creatorId?: number
  key?: string
  level?: number
  url?: string
  status?: number
}

export declare interface ServerPostListUpdateDto {
  id: number
  title?: string
  description?: string
  url?: string
  status?: number
  versionId?: number
  level?: number
  remark?: string
}

export declare interface ServerPostType {
  id: number
  title: string
  description: string
  url: string
  status: number
  remark: null
  versionId: number
  level: number
  creatorId: number
  createdAt: string
  updatedAt: string
  version: {
    id: number
    name: string
    type: 'online' | 'plugin' | 'original'
    version: string
  }
  creator: {
    id: number
    nickname: string
    headImg: string
  }
}
