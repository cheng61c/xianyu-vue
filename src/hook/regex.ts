import { formatLink } from './format'

export const extractImageSrcs = (html: string): string[] => {
  const regex = /<img[^>]+src=["']([^"']+)["']/g
  const result: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const src = match[1]
    result.push(formatLink(src))
  }

  return result
}

export const formatImageSrcsInHtml = (html: string): string => {
  const regex = /<img([^>]+)src=["']([^"']+)["']/g
  const currentProtocol = window.location.protocol // 'http:' 或 'https:'

  return html.replace(regex, (match, beforeSrc, src) => {
    if (src.startsWith(currentProtocol) || src.startsWith('//')) {
      const formattedSrc = formatLink(src.replace(/^.*api/, '')) // 确保 src 不以斜杠开头
      console.log('Formatted image src:', formattedSrc)

      return `<img${beforeSrc}src="${formattedSrc}"`
    }
    return match
  })
}
