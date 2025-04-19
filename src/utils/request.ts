import axios from 'axios'
import {useUserStore} from '@/store/userStore.ts'
const request = axios.create({
    baseURL: 'http://127.0.0.1:3000/api',
    timeout: 30000
})
request.interceptors.request.use(config => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, async (e) => {
    console.log(e)
    await Promise.reject(null);
})

request.interceptors.response.use( (response) => {
    return response.data
} ,  (error) => {
    if (error.response && error.response.status === 401) {
        return null;
    }
    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
            console.error('请求超时' , error);
        }
        console.error('请求错误' , error)

    }
    console.error('未知异常' , error)
    return null;
})


export default request;
