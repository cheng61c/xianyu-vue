<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
</script>

<template>
  <div
    :class="[
      'card',
      'w-full',
      'rounded-lg',
      'bg-base-100', // 背景色，使用 DaisyUI 提供的基本背景
      'border',
      themeStore.darkTheme ? 'border-white/5' : 'border-base-100',
      'm-4',
      'p-4',
      'transition-all',
      'duration-300',
      'shadow-lg',
    ]"
  >
    <slot />
  </div>
</template>
<style scoped></style>
