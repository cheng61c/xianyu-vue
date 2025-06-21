import { toHtml } from 'hast-util-to-html'
import { common, createLowlight } from 'lowlight'
import { useConfigStore } from '@/stores/configStore'
const lowlight = createLowlight(common)
const configStore = useConfigStore()

export const htmlToText = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

export const formatTime = (value: string | number | Date) => {
  let date: Date

  // 如果已经是 Date 对象，直接使用
  if (value instanceof Date) {
    date = value
  }
  // 如果是纯数字字符串（时间戳），转换为数字
  else if (typeof value === 'string' && /^\d+$/.test(value)) {
    date = new Date(parseInt(value, 10))
  }
  // 其他情况（ISO 字符串或数字时间戳），直接传给 Date 构造函数
  else {
    date = new Date(value)
    console.log(value, 'date:', date)
  }

  // 检查是否解析成功
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', value)
    return 'Invalid Date'
  }

  const [year, month, day, hours, minutes] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ]

  return year === new Date().getFullYear()
    ? `${month}-${day} ${hours}:${minutes}`
    : `${year}-${month}-${day} ${hours}:${minutes}`
}

export const formatTimeAgo = (dateString: string): string => {
  const sec = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  const { floor } = Math

  type TimeInterval = [boolean, string]
  const intervals: TimeInterval[] = [
    [sec < 60, '刚刚'],
    [sec < 3600, `${floor(sec / 60)}分钟前`],
    [sec < 86400, `${floor(sec / 3600)}小时前`],
    [sec < 2592000, `${floor(sec / 86400)}天前`],
    [sec < 31536000, `${floor(sec / 2592000)}个月前`],
    [true, `${floor(sec / 31536000)}年前`],
  ]

  return intervals.find(([condition]) => condition)?.[1] ?? '刚刚'
}

/**
 * 格式化数字为缩写形式（如 1000 → "1k"）
 * @param num 要格式化的数字
 * @param decimals 保留的小数位数（默认 1）
 * @returns 格式化后的字符串
 */
export const formatNumber = (
  num: number | string,
  decimals: number = 1
): string => {
  const numericValue = typeof num === 'string' ? parseFloat(num) : num // 转换字符串为数字
  if (numericValue < 1000) return numericValue.toString() // 小于 1000 直接返回

  const units = ['k', 'M', 'B', 'T'] // 千、百万、十亿、万亿
  const exponent = Math.floor(Math.log10(numericValue) / 3) // 计算单位级别
  const scaledNum = numericValue / Math.pow(1000, exponent) // 缩放数字

  // 处理小数部分（如 1200 → "1.2k" 而非 "1k"）
  const decimalPlaces = scaledNum % 1 === 0 ? 0 : decimals

  return `${scaledNum.toFixed(decimalPlaces)}${units[exponent - 1]}`
}

/**
 * 链接格式化，当前缀是一个完整域名则添加当前访问协议前缀
 */
export const formatLink = (link: string): string => {
  if (!link) return ''
  const reg = /^(blob:)?(http|https):\/\//i
  if (reg.test(link)) return link // 已经是完整链接，直接返回
  // 查询是否有域名
  const domainReg = /^(www|[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/.*)?$/
  if (domainReg.test(link)) {
    const { protocol } = window.location // 获取当前访问协议
    return `${protocol}//${link}` // 添加协议前缀
  }
  // 链接不完整
  return `${configStore.serverAddress}/${link.replace(/^\//, '')}` // 添加基础链接
}

/** 高亮处理 */
export const lightHtml = (html: string): string => {
  const codeBlock = extractCodeBlock(html)
  if (codeBlock) {
    // 解码 HTML 实体，因为代码块中的 < 和 & 等字符已经被转义
    const decodedCode = codeBlock
      .replace(/&#x3C;/g, '<')
      .replace(/&#x26;/g, '&')

    // 高亮处理代码
    const highlightedCode = lowlight.highlight('typescript', decodedCode)

    // 生成高亮后的 HTML
    const highlightedHtml = toHtml(highlightedCode, {
      allowDangerousHtml: true,
    })
    console.log('highlightedHtml', highlightedHtml)

    // 替换原始 HTML 中的代码块
    const finalHtml = html.replace(
      /<pre.*><code>.*?<\/code><\/pre>/s,
      `<pre class="language-typescript"><code>${highlightedHtml}</code></pre>`
    )
    return finalHtml
  }
  return html // 如果没有代码块，返回原始 HTML
}

const extractCodeBlock = (html: string) => {
  const regex = /<pre.*><code>(.*?)<\/code><\/pre>/s
  const match = html.match(regex)
  return match ? match[1] : null
}

/** 格式化文件大小 */
export const formatFileSize = (size: number | string): string => {
  if (typeof size === 'string') {
    size = parseInt(size, 10) // 确保是数字
  }
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
