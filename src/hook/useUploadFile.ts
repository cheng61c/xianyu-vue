import { upload } from '@/apis/common.ts'
import request from '@/utils/request.ts'

export const useUploadFile = ({
  callback,
  pattern,
}: {
  callback: (fileName: string) => void
  pattern: string
}) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = pattern
  input.onchange = async (e: Event) => {
    const file: File = (e.target as HTMLInputElement).files?.[0] || ({} as File)
    try {
      const res = await upload(file)
      const fileName =
        request.defaults.baseURL + '/upload/preview/' + res.data.filename
      callback(fileName)
    } catch (error) {
      console.error(error)
    }
  }
  document.body.appendChild(input)
  input.click()
  document.body.removeChild(input)
}
