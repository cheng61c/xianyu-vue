<script setup lang="ts">
import DevTools from '@/components/DevTools.vue'
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <router-view />
  </div>
  <div class="absolute bottom-0 right-0"><DevTools /></div>
</template>

<style scoped></style>
