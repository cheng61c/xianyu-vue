export declare interface Plate {
  id: number
  name: string
  /** 板块介绍 */
  description: string
  /** 帖子数量 */
  postCount: number
  /** 板块类型，1交流板块，2文件板块 */
  type: number
  disabled: boolean
}
