import { useConfigStore } from '@/stores/global/configStore'
import { useUserStore } from '@/stores/module/user/userStore'
import request from '@/utils/request'
import axios from 'axios'

/**
 * 分片上传文件并返回分片进度
 * @param file 文件对象
 * @param typeid 文件类型ID
 * @param chunkSize 分片大小（默认2MB）
 * @param onProgress 进度回调 (已上传分片数, 总分片数) => void
 */
export const uploadFileChunked = async (
  file: File,
  typeid?: number,
  chunkSize = 2 * 1024 * 1024,
  onProgress?: (uploadedChunks: number, totalChunks: number) => void
): Promise<any> => {
  const configStore = useConfigStore()
  const userStore = useUserStore()

  return new Promise((resolve, reject) => {
    const totalChunks = Math.ceil(file.size / chunkSize)
    let lastResponse: any = null

    const uploadChunk = async (chunkIndex: number): Promise<void> => {
      try {
        const start = chunkIndex * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('chunkIndex', chunkIndex.toString())
        formData.append('totalChunks', totalChunks.toString())
        formData.append('filename', file.name)
        if (typeid !== undefined) {
          formData.append('type', typeid.toString())
        }

        const response = await axios.post(configStore.uploadAddress, formData, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        })

        lastResponse = response

        // 进度回调
        if (onProgress) {
          onProgress(chunkIndex + 1, totalChunks)
        }

        if (chunkIndex < totalChunks - 1) {
          await uploadChunk(chunkIndex + 1)
        } else {
          resolve(lastResponse)
        }
      } catch (error) {
        reject(error)
      }
    }

    uploadChunk(0)
  })
}
/**
 * 获取用户文件列表
 * @param body 包含文件类型的请求体
 * @param body.types 文件类型，逗号分隔的字符串，1.存档scworld 2.家具scfpack 3.材质png、scbtex 4.皮肤scskin 5.模组scmod 6.图片 7.软件
 * @returns
 */
export const getFilesList = (body: {
  types: string
  page: number
  limit: number
}) => {
  return request({
    method: 'get',
    url: '/upload/list',
    params: body,
  })
}
