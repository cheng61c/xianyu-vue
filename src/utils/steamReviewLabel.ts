type ScoreDistribution = {
  [score: number]: number // 1 到 5 分
}

type ReviewData = {
  averageScore: number
  totalCount: number
  scoreDistribution: ScoreDistribution
}

type ReviewLabelResult = {
  label: string
  colorClass: string // TailwindCSS 颜色类
}

export const getSteamRatingLabel = (
  totalReviews: number,
  reviewData: ReviewData
): ReviewLabelResult => {
  if (totalReviews === 0 || reviewData.totalCount === 0) {
    return {
      label: '暂无评测',
      colorClass: 'text-gray-400',
    }
  }

  // 推荐率（4星 + 5星） / 总数
  const recommendedCount =
    (reviewData.scoreDistribution[4] || 0) +
    (reviewData.scoreDistribution[5] || 0)
  const ratio = recommendedCount / totalReviews

  if (totalReviews < 10) {
    return {
      label: '评测过少',
      colorClass: 'text-gray-400',
    }
  }

  if (ratio >= 0.95) {
    return { label: '好评如潮', colorClass: 'text-green-600' }
  }
  if (ratio >= 0.9) {
    return { label: '特别好评', colorClass: 'text-green-500' }
  }
  if (ratio >= 0.8) {
    return { label: '多半好评', colorClass: 'text-green-400' }
  }
  if (ratio >= 0.4) {
    return { label: '褒贬不一', colorClass: 'text-yellow-500' }
  }
  if (ratio >= 0.2) {
    return { label: '多半差评', colorClass: 'text-red-400' }
  }

  return { label: '差评如潮', colorClass: 'text-red-600' }
}
