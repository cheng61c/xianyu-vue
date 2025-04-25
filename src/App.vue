<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import DevTools from '@/components/DevTools.vue'
import { Notifications } from '@kyvg/vue3-notification'
const configStore = useConfigStore()
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <router-view />
  </div>
</template>

<style scoped></style>
