import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/module/user/userStore'
import { useConfigStore } from '@/stores/global/configStore'
import type { Api, ErrorResponse } from '@/types'

const configStore = useConfigStore()
const serverUrl = configStore.serverAddress
const userInfo = useUserStore()

const apiClient = axios.create({
  baseURL: serverUrl, // 替换为你的API基础地址
  timeout: 600000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 获取 token
    const token = userInfo.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    configStore.loading = true

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<Api>) => {
    configStore.loading = false
    return response
  },
  (error: AxiosError) => {
    const { response } = error
    const customError = error as ErrorResponse
    if (response) {
      const responseData = response.data as {
        message?: string
        msg?: string
        duplicates?: any[]
      }
      customError.msg = responseData.message || responseData.msg || '未知错误'
      customError.duplicates = responseData.duplicates || []
      customError.status = response.status
    } else {
      customError.msg = '服务器无响应'
      customError.status = 500
    }

    // 请求失败时触发的函数
    console.log('Request failed:', error)
    configStore.loading = false

    return Promise.reject(customError)
  }
)

export default apiClient
