import axios, { AxiosError } from 'axios'

import { useUserStore } from '@/stores/userStore'
import { useConfigStore } from '@/stores/configStore'
import type { Api, ErrorResponse } from '@/types'

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
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: Api) => {
    console.log('Response:', response)

    return response
  },
  (error: AxiosError) => {
    const { response } = error
    const customError = error as ErrorResponse
    if (response) {
      const responseData = response.data as { message?: string; msg?: string }
      customError.msg = responseData.message || responseData.msg || '未知错误'
      customError.status = response.status
    } else {
      customError.msg = '服务器无响应'
      customError.status = 500
    }
    return Promise.reject(customError)
  }
)

export default apiClient
