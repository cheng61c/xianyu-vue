export declare interface Role {
  id: number
  name: string
  status: number
  color: string
  className: string
  createdAt: string
  updatedAt: string
  users: {
    id: number
    nickname: string
  }[]
}

export declare interface UserRole {
  id: number
  name: string
  color: string
}

export declare interface RoleDto {
  id?: number
  color?: string
  name?: string
  status?: number
}

export declare interface RoleDisabledDto {
  id?: number
  disabled?: number
}
