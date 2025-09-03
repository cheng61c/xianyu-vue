class LevelSystem {
  private baseExp: number
  private exponent: number
  private offset: number

  constructor(baseExp = 100, exponent = 1.5, offset = 0) {
    this.baseExp = baseExp
    this.exponent = exponent
    this.offset = offset
  }

  getExpForLevel(level: number): number {
    return Math.floor(
      this.baseExp * Math.pow(level, this.exponent) + this.offset
    )
  }

  getTotalExpForLevel(level: number): number {
    let total = 0
    for (let i = 1; i < level; i++) {
      total += this.getExpForLevel(i)
    }
    return total
  }

  getLevelFromExp(exp: number): number {
    let level = 1
    while (this.getTotalExpForLevel(level + 1) <= exp) {
      level++
    }
    return level
  }
}

/**
 * 等级系统
 * - baseExp: 基础经验值
 * - exponent: 经验值增长曲线的指数
 * - offset: 经验值增长的偏移量
 */
const levelSystem = new LevelSystem(10, 1.7, 50)

export default levelSystem
