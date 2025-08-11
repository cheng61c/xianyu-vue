import type { EchartsOption } from './EchartsOption'

export interface AdminPanelInfo {
  recentLoginStats: {
    chart: EchartsOption
    count: any
  }
  recentRegisterStats: {
    chart: EchartsOption
    count: any
  }
  recentPostStats: {
    chart: EchartsOption
    count: any
  }
  recentResourcePostStats: {
    chart: EchartsOption
    count: any
  }
  recentCommentStats: {
    chart: EchartsOption
    count: any
  }
  totalUsers: any
  totalPosts: any
  totalResourcePosts: any
  totalServerPosts: any
  totalFiles: any
  totalPendingFiles: any
  totalComments: any
}
