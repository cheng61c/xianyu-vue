import request from '@/utils/request'

export const uploadFile = (file: File, type: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/' + type, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取用户文件列表
 * @param body 包含文件类型的请求体
 * @param body.types 文件类型，逗号分隔的字符串，1.存档scworld 2.家具scfpack 3.材质png、scbtex 4.皮肤scskin 5.模组scmod 6.图片 7.软件
 * @returns
 */
export const getFilesList = (body: { types: string }) => {
  return request({
    method: 'get',
    url: '/upload/list',
    params: body,
  })
}
