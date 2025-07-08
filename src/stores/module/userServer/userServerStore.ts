import { defineStore } from 'pinia'
import type { ServerPostType } from '@/types/ServerPost'

export const useUserServerStore = defineStore('userServer', {
  state: () => ({
    /** 分页信息 */
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    /** 资源加载中 */
    resLoding: false,
    /** 帖子列表 */
    posts: [] as ServerPostType[],
    /** 当前所选帖子索引 */
    currentPostIndex: -1,
    /** 模态框 */
    modal: {
      isDeletePost: false, // 是否显示删除帖子模态框
    },
  }),
  actions: {},
})
