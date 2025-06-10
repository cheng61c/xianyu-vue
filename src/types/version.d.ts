export declare interface Version {
  id: number
  name: string
  type: 'original' | 'plugin' | 'online'
  version: string
  createdAt?: string
  updatedAt?: string
}

export declare interface ApiVersion {
  id: number
  name: string
  type: 'original' | 'plugin' | 'online'
  version: string
  createdAt: string
  updatedAt: string
}

export declare interface PutVersionDto {
  name?: string
  type?: 'original' | 'plugin' | 'online'
  version?: string
}

export declare interface DisableVersionDto {
  id: number
  disabled: number
}
