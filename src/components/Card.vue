<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
</script>

<template>
  <div
    class="bg-background-200 px-6 py-2 transition-all duration-300 shadow-card border-card rounded-lg"
  >
    <slot />
  </div>
</template>
<style scoped></style>
