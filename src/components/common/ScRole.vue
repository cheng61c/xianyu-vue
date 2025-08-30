<template>
  <template v-if="props.isAll && userInfo.roles.length > 0">
    <ScTag :size="props.size" status="info">
      LV
      {{
        userInfo.level
          ? userInfo.level
          : levelSystem.getLevelFromExp(userInfo.exp)
      }}
    </ScTag>

    <ScTag
      v-for="role in userInfo.roles"
      :key="role.id"
      :bgColor="role.color"
      :size="props.size">
      {{ role.name }}
    </ScTag>
  </template>
  <template v-else-if="!userInfo.level && userInfo.roles.length > 0">
    <ScTag
      :bgColor="userInfo.roles[0]?.color"
      :size="props.size"
      :status="!userInfo.roles[0] ? 'info' : ''">
      {{ userInfo.level ? 'LV' : '' }} {{ userInfo.level }}
      {{ userInfo.roles[0]?.name ?? userInfo.rank }}
    </ScTag>
  </template>
  <template v-else>
    <ScTag
      :bgColor="userInfo.roles[0]?.color"
      :size="props.size"
      :status="!userInfo.roles[0] ? 'info' : ''">
      LV
      {{ levelSystem.getLevelFromExp(userInfo.exp) }}
      {{ userInfo.rank }}
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
  }>(),
  {
    size: 'md',
    isAll: false,
  }
)

const userInfo = computed(() => props.user || userStore.userInfo)
</script>
