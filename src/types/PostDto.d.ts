export default interface PostDto {
  /**标题 */
  title: string
  /** 板块id */
  plateId: number
  /** 内容 */
  content: string
  /** 封面 */
  cover: string
  /** 帖子类型，1帖子，2资源 */
  type: number
  /** 文件类型 */
  fileType?: number
  /** 引用的帖子id */
  dependencies?: number[]
  /** 帖子id */
  id?: number
}
