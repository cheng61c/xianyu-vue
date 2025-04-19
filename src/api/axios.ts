import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { useConfigStore } from '@/stores/configStore'
import { useUserStore } from '@/stores/userStore'

const configStore = useConfigStore()
const userStore = useUserStore()

const apiClient: AxiosInstance = axios.create({
  baseURL: configStore.baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 在请求发送之前做些什么
    // 例如，添加认证令牌到请求头
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use((response: AxiosResponse) => {
  return response.data
})

export default apiClient
