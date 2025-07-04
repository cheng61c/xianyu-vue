import { formatLink } from './format'

export const extractImageSrcs = (html: string): string[] => {
  const regex = /<img[^>]+src=["']([^"']+)["']/g
  const result: string[] = []
  let match: RegExpExecArray | null
  const currentProtocol = window.location.protocol // 'http:' 或 'https:'

  while ((match = regex.exec(html)) !== null) {
    const src = match[1]
    // 只保留协议一致的链接或相对路径
    if (
      src.startsWith(currentProtocol) ||
      src.startsWith('//') ||
      !src.startsWith('http')
    ) {
      result.push(formatLink(src))
    }
  }

  return result
}

export const formatImageSrcsInHtml = (html: string): string => {
  const regex = /<img([^>]+)src=["']([^"']+)["']/g
  const currentProtocol = window.location.protocol // 'http:' 或 'https:'

  return html.replace(regex, (match, beforeSrc, src) => {
    if (
      src.startsWith(currentProtocol) ||
      src.startsWith('//') ||
      !src.startsWith('http')
    ) {
      console.log('src:', src.replace(/\/?api/, ''))

      const formattedSrc = formatLink(src.replace(/\/?api/, '')) // 确保 src 不以斜杠开头
      console.log('formattedSrc:', formattedSrc)

      return `<img${beforeSrc}src="${formattedSrc}"`
    }
    return match
  })
}
