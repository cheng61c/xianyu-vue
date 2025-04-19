export interface UserType {
  id: number
  account: string
  nickname: string
  exp: number
  level: number
  money: number
  regTime: string
  lastLoginTime: string
  lastLoginIp: string
  email: string
  accountType: number
  headImg: string
  signature: string
  background: string
  roles: role[]
  rank: null | Array<number>
  postCount: number
  islogin: boolean
}

export interface ApiUser {
  token: string
  user: {
    /** 用户的唯一标识符 */
    id: number
    /** 用户名，用于登录的账号 */
    account: string
    /** 昵称，显示在用户资料和论坛中的名称 */
    nickname: string
    /** 用户账户余额 */
    money: number
    /** 经验值 */
    exp: number
    /** 用户的等级，通常与经验值相关联 */
    level: number
    /** 注册时间，格式为 ISO 时间字符串 */
    regTime: string
    /** 上次登录时间，格式为 ISO 时间字符串 */
    lastLoginTime: string
    /** 上次登录的 IP 地址 */
    lastLoginIp: string
    /** 用户的电子邮箱地址 */
    email: string
    /** 账户类型，标识用户身份或权限级别 */
    accountType: number
    /** 用户头像的图片 URL */
    headImg: string
    /** 用户的个性签名 */
    signature: string
    /** 用户个人资料页面的背景图片 URL */
    background: string
    /** 用户的角色 ID 列表 */
    roles: role[]
    /** 用户的段位等级列表，为 null 表示无段位 */
    rank: null | Array<number>
    /** 用户发布的帖子数量 */
    postCount: number
  }
}

export interface role {
  id: number
  name: string
  color: string
}
