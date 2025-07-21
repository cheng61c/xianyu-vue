import type { MenuItem } from '@/types/Config'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    /** 语言 */
    lang: 'zh',
    /** 自动登录 */
    autoLogin: false,
    // serverAddress: 'http://119.29.147.180/api'
    /** 后端接口 */
    serverAddress: 'https://dev.suancaixianyu.cn/api',
    // serverAddress: 'https://api.schub.top/api',
    /** 上传路径 */
    uploadPath: 'https://dev.suancaixianyu.cn/api/upload',
    // uploadPath: 'https://api.schub.top/api/upload',
    errorImg:
      'https://r2.schub.top/70f1f283c19356cabc66c7cae8216ea80cdab0d6139dfbbac2de6e4cdc79fa3d-error.png',

    /** 平板适配 */
    padAdaptation: false,

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
          const configPath = '../../../config.json'
          let res
          try {
            // 判断文件是否存在
            await import(configPath)
            res = await import(configPath)
          } catch (e) {
            return
          }
          // 将加载到的 config 合并进当前 state
          Object.assign(this.$state, res.default)
        } catch (err) {
          console.warn('无法加载 config.json，使用默认配置', err)
        }
      }
    },
  },

  persist: true,
})
