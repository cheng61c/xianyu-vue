<template>
  <template v-if="props.isAll && userInfo.roles && userInfo.roles.length > 0">
    <ScTag
      v-for="role in userInfo.roles"
      :key="role.id"
      :bgColor="role.color"
      :size="props.size">
      <template v-if="!props.noRole">{{ role.name }}</template>
    </ScTag>
  </template>
  <template v-else-if="props.isAll && userInfo.roles">
    <ScTag
      :bgColor="userInfo.roles[0]?.color ?? 'var(--color-active)'"
      :size="props.size"
      :status="!userInfo.roles[0] ? 'info' : ''">
      <template
        v-if="
          !props.noLevel &&
          (userInfo.level ?? levelSystem.getLevelFromExp(userInfo.exp))
        ">
        <span>
          Lv{{
            userInfo.level
              ? userInfo.level
              : levelSystem.getLevelFromExp(userInfo.exp)
          }}
        </span>
      </template>

      <span v-if="!props.noRole">
        {{ userInfo.roles[0]?.name ?? userInfo.rank }}
      </span>
    </ScTag>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/module/user/userStore'
import type { UserType } from '@/types'
import ScTag from './ScTag.vue'
import levelSystem from '@/utils/level'

const userStore = useUserStore()

const props = withDefaults(
  defineProps<{
    user?: UserType
    size?: 'xs' | 'sm' | 'md' | 'lg'
    isAll?: boolean
    noRole?: boolean
    noLevel?: boolean
  }>(),
  {
    size: 'md',
    isAll: false,
    noRole: false,
    noLevel: false,
  }
)

const userInfo = computed(() => {
  const user = props.user ?? userStore.userInfo
  // 获取user.roles,如果有就将里面的内容按照id排序
  if (user.roles) {
    user.roles.sort((a, b) => a.id - b.id)
  }
  return user
})
</script>
