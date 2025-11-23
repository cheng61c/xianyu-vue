import { toHtml } from 'hast-util-to-html'
import { createLowlight } from 'lowlight'
import csharp from 'highlight.js/lib/languages/csharp'
import { useConfigStore } from '@/stores/global/configStore'

const lowlight = createLowlight({
  csharp: csharp, // 只注册 C# 语言
})
const configStore = useConfigStore()

export const htmlToText = (html: string): string => {
  if (!html || html === '') return ''
  return String(html)
    .replace(/<img[^>]*>/gi, `[图片]`) // 替换所有 <img> 标签为 "[图片]"
    .replace(/<video[^>]*>.*?<\/video>/gis, `[视频]`) // 替换所有 <video> 标签为 "[视频]"
    .replace(/<a\s+[^>]*href=['"][^'"]+['"][^>]*>.*?<\/a>/gis, `[链接]`) // 替换所有 <a> 标签为 "[链接]"
    .replace(/<[^>]+>/g, '') // 移除其他所有 HTML 标签
    .replace(
      /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;|&#x27;|&#x2F;|&#x60;|&#x3D;/g,
      ''
    ) // 移除常见 HTML 实体
}

export const formatTimeOrAgo = (value: string | number | Date, t: any) => {
  let date: Date

  // 如果已经是 Date 对象，直接使用
  if (value instanceof Date) {
    date = value
  }
  // 如果是数字或数字字符串，需要判断是秒还是毫秒时间戳
  else if (
    typeof value === 'number' ||
    (typeof value === 'string' && /^\d+$/.test(value))
  ) {
    const timestamp = typeof value === 'number' ? value : parseInt(value, 10)

    // 判断时间戳是秒还是毫秒
    // 通常，13位数字是毫秒时间戳，10位数字是秒时间戳
    if (timestamp.toString().length === 10) {
      // 10位数字，秒时间戳，需要乘以1000转换为毫秒
      date = new Date(timestamp * 1000)
    } else if (timestamp.toString().length === 13) {
      // 13位数字，毫秒时间戳，直接使用
      date = new Date(timestamp)
    } else {
      // 其他长度的数字，尝试直接转换，如果失败则返回无效日期
      date = new Date(timestamp)
    }
  }
  // 其他情况（ISO 字符串），直接传给 Date 构造函数
  else {
    date = new Date(value)
  }

  // 检查是否解析成功
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  // 如果是当天的日期，调用 formatTimeAgo
  if (today.getTime() === date.getTime()) {
    return formatTimeAgo(value.toString(), t)
  } else {
    return formatTime(value)
  }
}

export const formatTime = (value: string | number | Date) => {
  let date: Date

  // 如果已经是 Date 对象，直接使用
  if (value instanceof Date) {
    date = value
  }
  // 如果是数字或数字字符串，需要判断是秒还是毫秒时间戳
  else if (
    typeof value === 'number' ||
    (typeof value === 'string' && /^\d+$/.test(value))
  ) {
    const timestamp = typeof value === 'number' ? value : parseInt(value, 10)

    // 判断时间戳是秒还是毫秒
    // 通常，13位数字是毫秒时间戳，10位数字是秒时间戳
    if (timestamp.toString().length === 10) {
      // 10位数字，秒时间戳，需要乘以1000转换为毫秒
      date = new Date(timestamp * 1000)
    } else if (timestamp.toString().length === 13) {
      // 13位数字，毫秒时间戳，直接使用
      date = new Date(timestamp)
    } else {
      // 其他长度的数字，尝试直接转换，如果失败则返回无效日期
      date = new Date(timestamp)
    }
  }
  // 其他情况（ISO 字符串），直接传给 Date 构造函数
  else {
    date = new Date(value)
  }

  // 检查是否解析成功
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const [year, month, day, hours, minutes] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ]

  // 补零
  const pad = (n: number) => n.toString().padStart(2, '0')

  return year === new Date().getFullYear()
    ? `${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}`
    : `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}`
}

/**
 * 格式化时间为多久前
 * @param date 时间
 * @param t 本地化
 * @returns 返回多久前的时间
 */
export const formatTimeAgo = (date: string | number, t: any): string => {
  // 统一转换为时间戳（毫秒）
  const timestamp =
    typeof date === 'string' && /^\d+$/.test(date)
      ? new Date(Number(date)).getTime()
      : new Date(date).getTime()
  const sec = Math.floor((Date.now() - timestamp) / 1000)
  const { floor } = Math

  type TimeInterval = [boolean, string]
  const intervals: TimeInterval[] = [
    [sec < 60, t('b.gang-gang')],
    [sec < 3600, t('b.floorsec-60-fen-zhong-qian', [floor(sec / 60)])],
    [sec < 86400, t('b.floorsec-3600-xiao-shi-qian', [floor(sec / 3600)])],
    [sec < 2592000, t('b.floorsec-86400-tian-qian', [floor(sec / 86400)])],
    [
      sec < 31536000,
      t('b.floorsec-2592000-ge-yue-qian', [floor(sec / 2592000)]),
    ],
    [true, t('b.floorsec-31536000-nian-qian', [floor(sec / 31536000)])],
  ]

  return intervals.find(([condition]) => condition)?.[1] ?? t('b.gang-gang')
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
 * 格式化数字, 当数字超过99时显示99+
 * @param num 要格式化的数字
 */
export const formatNumberWithLimit = (num: number | string): string => {
  const numericValue = typeof num === 'string' ? parseFloat(num) : num // 转换字符串为数字
  return numericValue > 99 ? '99+' : numericValue.toString()
}

/**
 * 链接格式化
 * - 已是完整链接 (http, https, blob) -> 返回原值
 * - 是域名（不带协议） -> 补上当前协议
 * - 是本地地址（IP或localhost） -> 替换为 configStore.serverAddress
 * - 是相对路径 -> 拼接 configStore.serverAddress
 */
export const formatLink = (link: string, download = false): string => {
  if (!link) return ''

  // 检查是否是完整链接
  if (/^(https?|blob):\/\//i.test(link)) {
    return link
  }

  // 检查是否是域名（不带协议）
  if (/^[a-zA-Z0-9.-]+$/.test(link)) {
    return `${window.location.protocol}//${link}`
  }

  // 检查是否是本地地址（IP或localhost）
  if (
    /^(https?:\/\/)?(localhost|127\.0\.0\.1|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/.test(
      link
    )
  ) {
    return `${configStore.serverAddress}/${link}`
  }

  // 去掉 ./ 前缀
  if (link.startsWith('./')) {
    link = link.substring(2)
  }

  if (download) {
    link = link.replace(/\/upload/, '/upload/download')
  }

  // 如果是相对路径，拼接 serverAddress
  return `${configStore.serverAddress}${link.startsWith('/') ? '' : '/'}${link}`
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
    const highlightedCode = lowlight.highlight('csharp', decodedCode)

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

/**
 * XML 格式化（替代 prettier）
 * @param xml 原始 XML 字符串
 * @param indentSize 缩进空格数（取自 tabWidth.value）
 */
export const formatXml = (xml: string, indentSize: number = 2): string => {
  try {
    // 1. 用浏览器原生解析器校验 XML 结构
    const doc = new DOMParser().parseFromString(xml, 'text/xml')
    if (doc.querySelector('parsererror')) {
      console.warn('无效的xml结构，无法格式化')
      return xml // 不是合法 XML 时返回原内容
    }

    // 2. 递归缩进格式化
    let formatted = ''
    const indent = (n: number) => ' '.repeat(n * indentSize)

    const formatNode = (node: Node, depth: number) => {
      // 处理元素节点
      if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as Element

        // 开标签
        formatted += `${indent(depth)}<${elem.tagName}`

        // 属性缩进处理（属性换行显示）
        if (elem.hasAttributes()) {
          formatted += Array.from(elem.attributes)
            .map((attr) => `\n${indent(depth + 1)}${attr.name}="${attr.value}"`)
            .join('')
        }

        // 自闭合标签
        if (!elem.childNodes.length && !elem.textContent?.trim()) {
          formatted += ' />\n'
          return
        }

        formatted += '>\n'

        // 递归子节点
        Array.from(elem.childNodes).forEach((child) =>
          formatNode(child, depth + 1)
        )

        // 闭标签
        formatted += `${indent(depth)}</${elem.tagName}>\n`
      }
      // 处理文本节点（保留有意义的内容）
      else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        formatted += `${indent(depth)}${node.textContent.trim()}\n`
      }
    }

    // 从根节点开始格式化
    formatNode(doc.documentElement, 0)
    return formatted.trim()
  } catch (e) {
    console.error('XML formatting failed:', e)
    return xml // 解析失败时返回原内容
  }
}
