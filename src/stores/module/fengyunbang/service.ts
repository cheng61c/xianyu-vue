import { heloApi } from '@/apis'
import { useFengYunBangStore } from './FengYunBangStore'
import type { FengYunBang } from '@/types/FengYunBang'
import { formatTime } from '@/utils/format'

const fengYunBangStore = useFengYunBangStore()

export const getFengYunBangAll = () => {
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
