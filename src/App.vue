<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import DevTools from '@/components/DevTools.vue'
const configStore = useConfigStore()
</script>

<template>
  <router-view />
  <DevTools class="sm:hidden" />
</template>

<style scoped></style>
