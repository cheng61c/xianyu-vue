<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import DevTools from '@/components/DevTools.vue'
import { Notifications } from '@kyvg/vue3-notification'
const configStore = useConfigStore()
</script>

<template>
  <router-view />
  <DevTools class="sm:hidden" />
  <Notifications />
</template>

<style scoped></style>
