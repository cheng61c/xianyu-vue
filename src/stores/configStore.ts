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
  }),
  persist: true,
})
