import { heloApi } from '@/apis'
import { useFengYunBangStore } from './FengYunBangStore'
import type { FengYunBang } from '@/types/FengYunBang'
import { formatTimeOrAgo, formatUploadImage } from '@/utils/format'
import { useToast } from 'vue-toastification'
const toast = useToast()
const fengYunBangStore = useFengYunBangStore()
export const getFengYunBangAll = async (t: any) => {
  heloApi.getFengYunBangAll().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data
      fengYunBangStore.list = data.map((item: FengYunBang) => ({
        ...item,
        createdAt: formatTimeOrAgo(item.createdAt, t),
        updatedAt: formatTimeOrAgo(item.updatedAt, t),
      }))
      console.log('fengYunBangStore', fengYunBangStore)
    }
  })
}

export const getFengYunBangList = async (t: any) => {
  heloApi.getFengYunBangList().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data
      fengYunBangStore.list = data.list.map((item: FengYunBang) => ({
        ...item,
        createdAt: formatTimeOrAgo(item.createdAt, t),
        updatedAt: formatTimeOrAgo(item.updatedAt, t),
      }))
      console.log('fengYunBangStore', fengYunBangStore)
    }
  })
}

export const addFengYunBang = (
  body: {
    title: string
    headImg: string
    content: string
    id?: number
  },
  t: any,
  close?: () => void
) => {
  const apiMethod =
    body.id && body.id != 0 ? 'updateFengYunBang' : 'createFengYunBang'
  body.content = formatUploadImage(body.content)
  ;(heloApi as any)[apiMethod](body).then(async (res: any) => {
    if (res.data.code === 200) {
      toast.success('操作成功')
      await getFengYunBangAll(t)
      if (close) {
        close()
      }
    }
  })
}

export const deleteFengYunBang = (id: number, t: any, close?: () => void) => {
  heloApi.deleteFengYunBang(id).then(async (res: any) => {
    if (res.data.code === 200) {
      toast.success('删除成功')
      await getFengYunBangAll(t)
      if (close) {
        close()
      }
    }
  })
}
