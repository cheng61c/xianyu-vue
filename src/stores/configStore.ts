import type { MenuItem } from '@/types/Config'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    /** API 请求地址 */
    baseURL: '',

    /** 语言 */
    lang: 'zh',
    /** 自动登录 */
    autoLogin: false,
    // serverAddress: 'http://119.29.147.180/api'
    /** 后端接口 */
    serverAddress: 'http://localhost:3000/api',
    /** 上传路径 */
    uploadPath: 'http://localhost:3000/api/upload',

    /** 当前大板块 */
    currentPlate: {
      name: '',
      pathName: '',
    },

    menuItems: <MenuItem[]>[
      { name: '交流帖子', path: '/postList/0', pathName: 'postList', type: 1 },
      { name: '资源下载', path: '/modList/0', pathName: 'modList', type: 2 },
    ],
  }),
  persist: true,
})
