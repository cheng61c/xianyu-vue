import type { AxiosError, AxiosResponse } from 'axios'

export interface Api extends AxiosResponse {
  data: {
    code: number // 接口返回的状态码
    data: any // 如果有其他返回数据
    msg: string // 接口返回的消息
  }
}

export interface ErrorResponse extends AxiosError {
  /** 服务器响应错误提示 */
  msg: string
  status?: number
}
