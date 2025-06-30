export declare interface ScoreSummary {
  averageScore: number
  totalCount: number
  scoreDistribution: {
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
  }
}

export declare interface ScoreType {
  id: number
  userId: number
  postId: number
  score: number
  content: string
  createdAt: string
  updatedAt: string
  isBaded: boolean
  badCount: number
  isLiked: boolean
  likeCount: number
  image: string[]
  author: {
    id: number
    nickname: string
    headImg: string
  }
}
