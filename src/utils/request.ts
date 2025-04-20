import axios from 'axios'

import { useUserStore } from '@/stores/userStore'
import { useConfigStore } from '@/stores/configStore'
import type { Api } from '@/types'

const config = useConfigStore()
const serverUrl = config.serverAddress
const userInfo = useUserStore()

const apiClient = axios.create({
  baseURL: serverUrl, // 替换为你的API基础地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    // 获取 token
    const token = userInfo.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 打印请求信息，包括 Query 参数和请求体
    // console.log('请求信息:', {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   params: config.params || {}, // Query 参数
    //   data: config.data || {}, // 请求体
    // })

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as Api
    response.data = data
    return response
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

export default apiClient
