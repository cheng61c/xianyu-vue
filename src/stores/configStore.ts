import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    /** API 请求地址 */
    baseURL: '',

    /** 语言 */
    lang: 'zh',

    /** 主题模式 */
    themeMode: 'light',
  }),
  persist: true,
})
