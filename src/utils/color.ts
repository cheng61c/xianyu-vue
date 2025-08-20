/**
 * 调整颜色饱和度并支持变暗
 * @param color 颜色值 (#RRGGBB, #RGB, rgba(R,G,B,A))
 * @param saturate 饱和度增量 (0-1)
 * @param darken 变暗系数 (0-1)
 * @returns 调整后的颜色，保持原始格式；无法识别则原样返回
 */
export function adjustColor(
  color: string,
  saturate: number = 0.5,
  darken: number = 0
): string {
  // 解析颜色
  let r: number,
    g: number,
    b: number,
    a: number = 1
  let isRgba = false

  // 尝试解析RGBA
  const rgbaMatch = color.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/i
  )
  if (rgbaMatch) {
    isRgba = true
    r = parseInt(rgbaMatch[1])
    g = parseInt(rgbaMatch[2])
    b = parseInt(rgbaMatch[3])
    a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1

    // 验证RGBA值范围
    if ([r, g, b].some((v) => v < 0 || v > 255) || a < 0 || a > 1) {
      return color // 值超出范围，原样返回
    }
  }
  // 尝试解析HEX
  else if (
    /^#([A-Fa-f0-9]{3}){1,2}$/.test(color) ||
    /^#([A-Fa-f0-9]{4}){1,2}$/.test(color)
  ) {
    const hex = color.substring(1)
    if (hex.length === 3 || hex.length === 4) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    } else {
      return color // 无法识别的HEX格式
    }
  } else {
    return color // 无法识别的颜色格式
  }

  // 转换为 0-1 范围
  let red = r / 255
  let green = g / 255
  let blue = b / 255

  // 计算灰度值
  const gray = 0.2989 * red + 0.587 * green + 0.114 * blue

  // 调整饱和度
  red = gray + (red - gray) * (1 + saturate)
  green = gray + (green - gray) * (1 + saturate)
  blue = gray + (blue - gray) * (1 + saturate)

  // 调整亮度
  if (darken > 0) {
    red *= 1 - darken
    green *= 1 - darken
    blue *= 1 - darken
  }

  // 限制在 0-1 范围
  red = Math.min(1, Math.max(0, red))
  green = Math.min(1, Math.max(0, green))
  blue = Math.min(1, Math.max(0, blue))

  // 转换回原始格式
  if (isRgba) {
    return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${a})`
  } else {
    const toHex = (x: number) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0')
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
  }
}

// 使用示例
// console.log(adjustColor('#FFEE92', 0.8)) // 增加饱和度
// console.log(adjustColor('rgba(255,171,69,0.8)', 0.5, 0.1)) // 增加饱和度并稍微变暗
// console.log(adjustColor('invalid-color', 0.5)) // 原样返回 "invalid-color"
// console.log(adjustColor('rgb(300,0,0)', 0.5)) // 原样返回 "rgb(300,0,0)"（值超出范围）
// console.log(adjustColor('#abc', 0.3)) // 支持3位HEX
// console.log(adjustColor('#aabbcc', 0.3)) // 支持6位HEX

/**
 * 应用主题
 * @param isDark 是否为暗色主题
 */
export function applyTheme(isDark: boolean) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark)
}
