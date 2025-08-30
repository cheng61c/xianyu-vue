export declare interface ReportType {
  id: number
  targetId: number
  targetType: number
  userId: number
  reason: string
  status: number
  handlerId: number
  result: string
  createdAt: string
  updatedAt: string
  creator: UserType
  handler: UserType
  target: any
}

export declare interface ReportCreateDto {
  targetId: number
  /**目标类型, 1-帖子，2-评论，3-服务器，4-用户 */
  targetType: number
  reason: string
}

export declare interface ReporUpdateDto {
  id: number
  status: number
  result: string
}

export declare interface ReportDto {
  page?: number
  limit?: number
  targetId?: number | string
  targetType?: number | string
  userId?: number | string
  status?: number | string
  handlerId?: number | string
}
