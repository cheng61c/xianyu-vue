export interface InfoType {
  id: number
  /** 用户id */
  operator: string
  module: string
  path: string
  params: string
  ip: string
  userAgent: string
  createdAt: string
  updatedAt: string
  creator: {
    id: number
    nickname: string
    roles: {
      id: number
      name: string
      color: string
    }[]
  }
}

export interface QueryInfoDto {
  page?: number
  limit?: number
  operator?: number
  ip?: string
}
