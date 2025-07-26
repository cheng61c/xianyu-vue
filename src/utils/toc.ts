// utils/toc.ts
export interface TocItem {
  level: number
  text: string
  id: string
}

export function generateTocFromHtml(html: string): TocItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const toc: TocItem[] = []

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1))
    const text = heading.textContent?.trim() || `标题 ${index}`
    const id = heading.getAttribute('id') || `heading-${index}`

    toc.push({ level, text, id })
  })

  return toc
}
