import type { Plate } from '@/types/Plate'
import type { Post } from '@/types/Post'
import type { TocItem } from '@/utils/toc'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    /** 板块缓存 */
    plate: {} as Record<string, Plate[]>,
    /** 搜索历史 */
    searchHistory: [] as string[],
    /** 草稿 */
    drafts: {} as Record<string, any>,
    /** 上传的图片与本地文件映射 */
    uploadImageMap: {} as { [key: string]: string },

    /** 当前大板块 */
    currentPlate: {
      /** 当前路由 postList 和 modList*/
      currentRouteName: '',

      /** 当前所在的板块名称 */
      name: '',
      /** 当前所在的板块地址 */
      pathName: '',
      /** 当前激活的板块ID */
      activation: 0 as number,
    },
    /** 桌面端导航 */
    nav: {
      /** 当前路由 postList 和 modList*/
      name: '',
    },

    /** 分页信息 */
    postPage: {
      page: 1,
      total: 0,
      limit: 10,
    },
    /** 帖子列表 */
    post: [] as Post[],
    /** 当前板块ID */
    plateId: 0 as number,
    /** 搜索词 */
    searchText: '',
    /** 是否搜索状态 */
    isSearch: false,
    /** 页面按钮当前位置 */
    buttonBottom: 60,

    /** 排序方式 */
    orderType: 1,
    /** 文件类型 */
    fileType: 0,

    /** 当前帖子详情信息 */
    postData: {} as Post | null,
    /** 当前帖子目录列表 */
    tocList: [] as TocItem[],
    /** 页面加载是否出错 */
    errorPage: false,
  }),
  persist: true,
})
