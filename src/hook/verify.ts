import { useUserStore } from '@/stores/userStore'
import type { role } from '@/types'

const userStore = useUserStore()
/**
 * `1 超管` `2 管理员` `3 用户管理` `4 服务器管理` `5 帖子管理` `6 公告管理` `7 审核` `8 服主` `9 帖子管理` `10 游戏版本号管理`
 * @param ids 支持的角色id
 * @returns
 */
export const verifyPermissions = (ids: number[]) => {
  // 获取当前用户的角色列表
  const userRoles = userStore.userInfo.roles
  if (!userRoles) return false
  // 获取当前用户的角色ID列表
  const userRoleIds = userRoles.map((role: role) => role.id)
  // 检查是否有任何一个角色ID在支持的角色ID列表中
  const hasPermission = ids.some((id) => userRoleIds.includes(id))
  return hasPermission
}
