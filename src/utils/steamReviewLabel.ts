import { useI18n } from 'vue-i18n'

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
  const { t } = useI18n()
  if (totalReviews === 0 || reviewData.totalCount === 0) {
    return {
      label: t('t.zan-wu-ping-ce'),
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
      label: t('t.ping-ce-guo-shao'),
      colorClass: 'text-gray-400',
    }
  }

  if (ratio >= 0.95) {
    return { label: t('t.hao-ping-ru-chao'), colorClass: 'text-green-600' }
  }
  if (ratio >= 0.9) {
    return { label: t('t.te-bie-hao-ping'), colorClass: 'text-green-500' }
  }
  if (ratio >= 0.8) {
    return { label: t('t.duo-ban-hao-ping'), colorClass: 'text-green-400' }
  }
  if (ratio >= 0.4) {
    return { label: t('t.bao-bian-bu-yi'), colorClass: 'text-yellow-500' }
  }
  if (ratio >= 0.2) {
    return { label: t('t.duo-ban-cha-ping'), colorClass: 'text-red-400' }
  }

  return { label: t('tcha-ping-ru-chao'), colorClass: 'text-red-600' }
}
