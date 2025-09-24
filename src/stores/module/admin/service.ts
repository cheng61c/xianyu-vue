import { adminPanelApi } from '@/apis'
import type { AdminPanelInfo } from '@/types/PanelInfo'

export const getPanelInfo = async (t: any): Promise<AdminPanelInfo> => {
  const res = await adminPanelApi.getPanel()
  if (res.data.code == 200) {
    const data = res.data.data
    return {
      recentLoginStats: {
        chart: getEChartsTemplate(
          t('d.zui-jin-deng-lu-datarecentloginstatscount', [
            data.recentLoginStats.count,
          ]),
          data.recentLoginStats.list
        ),
        count: data.recentLoginStats.count,
      },
      recentRegisterStats: {
        chart: getEChartsTemplate(
          t('d.zui-jin-zhu-ce-datarecentregisterstatscount', [
            data.recentRegisterStats.count,
          ]),
          data.recentRegisterStats.list
        ),
        count: data.recentRegisterStats.count,
      },
      recentPostStats: {
        chart: getEChartsTemplate(
          t('d.zui-jin-fa-bu-de-tie-zi-datarecentpoststatscount', [
            data.recentPostStats.count,
          ]),
          data.recentPostStats.list
        ),
        count: data.recentPostStats.count,
      },
      recentResourcePostStats: {
        chart: getEChartsTemplate(
          t('d.zui-jin-fa-bu-de-zi-yuan-datarecentresourcepoststatscount', [
            data.recentResourcePostStats.count,
          ]),
          data.recentResourcePostStats.list
        ),
        count: data.recentResourcePostStats.count,
      },
      recentCommentStats: {
        chart: getEChartsTemplate(
          t('d.zui-jin-fa-bu-de-ping-lun-datarecentcommentstatscount', [
            data.recentCommentStats.count,
          ]),
          data.recentCommentStats.list
        ),
        count: data.recentCommentStats.count,
      },

      totalUsers: data.totalUsers,
      totalPosts: data.totalPosts,
      totalResourcePosts: data.totalResourcePosts,
      totalServerPosts: data.totalServerPosts,
      totalFiles: data.totalFiles,
      totalPendingFiles: data.totalPendingFiles,
      totalComments: data.totalComments,
    }
  }
  return {} as AdminPanelInfo
}

const getEChartsTemplate = (title: string, data: any): any => {
  const xAxis = Object.keys(data) as never[]
  const series = Object.values(data) as never[]

  return {
    title: { text: title },

    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: series,
        type: 'line',
        smooth: true,
        markPoint: {
          data: [{ type: 'min' }, { type: 'max' }],
        },
      },
    ],
  }
}
