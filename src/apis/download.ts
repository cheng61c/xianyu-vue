import { formatLink } from '@/utils/format'

export const download = async (url: string, download = false) => {
  if (!url) return
  console.log(formatLink(url, download))
  // return

  // 在新标签页打开
  window.open(formatLink(url, download), '_blank')
}
