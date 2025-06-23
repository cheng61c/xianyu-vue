<script setup lang="ts">
import DevTools from '@/components/common/DevTools.vue'
</script>

<template>
  <div class="w-screen h-screen overflow-hidden bg-background">
    <router-view />
  </div>
  <div class="absolute bottom-0 right-0"><DevTools /></div>
</template>

<style scoped></style>
