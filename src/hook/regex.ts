export const extractImageSrcs = (html: string): string[] => {
  const regex = /<img[^>]+src=["']([^"']+)["']/g
  const result: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    result.push(match[1])
  }

  return result
}
