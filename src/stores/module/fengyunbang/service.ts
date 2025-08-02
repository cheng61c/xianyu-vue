import { heloApi } from '@/apis'
import { useFengYunBangStore } from './FengYunBangStore'
import type { FengYunBang } from '@/types/FengYunBang'
import { formatTime } from '@/utils/format'
import { useToast } from 'vue-toastification'
const toast = useToast()

const fengYunBangStore = useFengYunBangStore()

export const getFengYunBangAll = async () => {
  heloApi.getFengYunBangAll().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data
      fengYunBangStore.list = data.map((item: FengYunBang) => ({
        ...item,
        createdAt: formatTime(item.createdAt),
        updatedAt: formatTime(item.updatedAt),
      }))
      console.log('fengYunBangStore', fengYunBangStore)
    }
  })
}

export const getFengYunBangList = async () => {
  heloApi.getFengYunBangList().then((res) => {
    if (res.data.code === 200) {
      const data = res.data.data
      fengYunBangStore.list = data.list.map((item: FengYunBang) => ({
        ...item,
        createdAt: formatTime(item.createdAt),
        updatedAt: formatTime(item.updatedAt),
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
  _t: any,
  close?: () => void
) => {
  const apiMethod =
    body.id && body.id != 0 ? 'updateFengYunBang' : 'createFengYunBang'
  ;(heloApi as any)[apiMethod](body).then(async (res: any) => {
    if (res.data.code === 200) {
      toast.success('操作成功')
      await getFengYunBangAll()
      if (close) {
        close()
      }
    }
  })
}
