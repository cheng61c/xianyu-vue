import request from '@/utils/request.ts'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const downloadFile = async (fileName: string, vid: number) => {
  return request
    .get(`/upload/download?filename=${fileName}&versionId=${vid}`)
    .then((response) => {
      const { url: url_1 } = response.data.data
      if (url_1) {
        const name = fileName.split('-').pop()
        if (!name) {
          toast.error('文件名解析失败')
          return
        }

        // 创建一个隐藏的a标签触发下载
        const link = document.createElement('a')
        link.href = url_1
        link.download = name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
    .catch((error) => {
      toast.error('下载文件失败:' + error.msg)
    })
}
