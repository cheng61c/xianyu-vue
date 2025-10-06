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

export const removeHtmlTags = (str: string): string => {
  // 若输入不是字符串，直接返回空字符串或原内容（根据需求调整）
  if (typeof str !== 'string') {
    return ''
  }
  // 正则匹配所有 HTML 标签（<...>）并替换为空字符串
  return str.replace(/<[^>]*>/g, '')
}

export const formatImageSrcsInHtml = (html: string): string => {
  if (!html) return ''
  const imgRegex = /<img([^>]+)src=["']([^"']+)["']/g
  const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi

  // 清理外部样式和脚本
  const cleanedHtml = String(html)
    .replace(linkRegex, '')
    .replace(scriptRegex, '')
    .replace(styleRegex, '')

  const wrappedHtml = wrapUnwrappedUrls(cleanedHtml)

  return wrappedHtml.replace(imgRegex, (_, beforeSrc, src) => {
    const formattedSrc = formatLink(src.replace(/^.*api/, '')) // 确保 src 不以斜杠开头
    return `<img${beforeSrc}src="${formattedSrc}"`
  })
}

/**
 * 自动为未包裹的URL添加<a>标签
 * @param {string} html - 要处理的HTML字符串
 * @returns {string} 处理后的HTML字符串
 */
function wrapUnwrappedUrls(html: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // 递归处理所有文本节点
  function processTextNodes(node: any) {
    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'A') {
      Array.from(node.childNodes).forEach(processTextNodes)
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi

      // 检查父节点链中是否有a标签
      let parent = node.parentNode
      let isWrapped = false

      while (parent !== tempDiv && parent !== null) {
        if (parent.nodeName === 'A') {
          isWrapped = true
          break
        }
        parent = parent.parentNode
      }

      // 如果当前文本节点没有被a标签包裹，处理其中的URL
      if (!isWrapped && urlRegex.test(text)) {
        const newHtml = text.replace(
          urlRegex,
          '<a href="$1" target="_blank" rel="noopener" class="text-active">$1</a>'
        )

        // 如果文本中有URL，替换整个文本节点
        if (newHtml !== text) {
          const newElement = document.createElement('span')
          newElement.innerHTML = newHtml
          node.parentNode.replaceChild(newElement, node)
        }
      }
    }
  }

  Array.from(tempDiv.childNodes).forEach(processTextNodes)
  return tempDiv.innerHTML
}

export const useEmailRegex = (value: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}
