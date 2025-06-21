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
      result.push(src)
    }
  }

  return result
}
