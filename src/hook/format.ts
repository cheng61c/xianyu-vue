export const htmlToText = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

export const formatTime = (value: string | number | Date) => {
  const d = new Date(value)
  const [year, month, day, hours, minutes] = [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
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
  const reg = /^(http|https):\/\//i
  if (reg.test(link)) return link // 已经是完整链接，直接返回
  const { protocol } = window.location // 获取当前访问协议
  return `${protocol}//${link}` // 添加协议前缀
}
