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
    // serverAddress: 'https://api.schub.top/api',
    /** 上传路径 */
    uploadPath: 'http://localhost:3000/api/upload',
    // uploadPath: 'https://api.schub.top/api/upload',
    errorImg:
      'https://r2.schub.top/70f1f283c19356cabc66c7cae8216ea80cdab0d6139dfbbac2de6e4cdc79fa3d-error.png',

    /** 当前大板块 */
    currentPlate: {
      /** 当前所在的板块名称 */
      name: '',
      /** 当前所在的板块地址 */
      pathName: '',
    },
    /** 当前小板块 */
    currentPlateId: 0,

    menuItems: <MenuItem[]>[
      { name: '交流帖子', path: '/postList/0', pathName: 'postList', type: 1 },
      { name: '资源下载', path: '/modList/0', pathName: 'modList', type: 2 },
    ],

    fileTypes: [
      { value: 1, label: '存档' },
      { value: 2, label: '家具' },
      { value: 3, label: '材质' },
      { value: 4, label: '皮肤' },
      { value: 5, label: '模组' },
      { value: 7, label: '其他' },
    ],
  }),
  actions: {
    /** 运行时加载配置 */
    async loadRuntimeConfig() {
      try {
        const res = await fetch('/config.json')
        const config = await res.json()

        // 将加载到的 config 合并进当前 state
        Object.assign(this.$state, config)
      } catch (err) {
        console.warn('无法加载 config.json，使用默认配置', err)
      }
    },
  },
  persist: true,
})
