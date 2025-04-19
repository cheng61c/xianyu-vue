export interface Api {
  code: number // 接口返回的状态码
  data: any // 如果有其他返回数据
  msg: string // 接口返回的消息
}
