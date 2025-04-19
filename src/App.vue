<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <router-view />
</template>

<style scoped></style>
