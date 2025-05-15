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
  user: UserType
}

export interface role {
  id: number
  name: string
  color: string
}
