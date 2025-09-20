import type { MenuItem } from '@/types/Config'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    /** 默认语言 */
    lang: { value: 'zh', label: '简体中文' },
    langs: [
      { value: 'zh', label: '简体中文' },
      { value: 'en', label: 'English' },
    ],
    /** 自动登录 */
    autoLogin: false,
    /** 后端接口 */
    serverAddress: 'http://192.168.28.238:3000/api',
    // serverAddress: 'https://api.schub.top/api',
    errorImg:
      'https://r2.schub.top/70f1f283c19356cabc66c7cae8216ea80cdab0d6139dfbbac2de6e4cdc79fa3d-error.png',

    /** 平板适配 */
    padAdaptation: false,
    /** 网络请求中 */
    loading: false,

    menuItems: <MenuItem[]>[
      {
        name: '交流帖子',
        pathName: 'postList',
        params: { plateId: 0 },
        type: 1,
      },
      {
        name: '资源下载',
        pathName: 'modList',
        params: { plateId: 0 },
        type: 2,
      },
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
      // 检查当前域名是否为本地域名或本地ip
      const isLocal =
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1' ||
        location.hostname === '::1' ||
        /^192\.168\.\d+\.\d+$/.test(location.hostname) ||
        /^10\.\d+\.\d+\.\d+$/.test(location.hostname) ||
        /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(location.hostname)

      if (!isLocal) {
        try {
          try {
            const res = await import('../../../config.json')
            // 将加载到的 config 合并进当前 state
            Object.assign(this.$state, res.default)
          } catch (e) {
            return
          }
        } catch (err) {
          console.warn('无法加载 config.json，使用默认配置', err)
        }
      } else {
        console.log('本地环境，使用默认配置')
        this.serverAddress = 'http://192.168.28.238:3000/api'
      }
    },
  },

  persist: true,
})
