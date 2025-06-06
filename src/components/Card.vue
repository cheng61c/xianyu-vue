<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  activation?: boolean
  noPg?: boolean
  noBg?: boolean
  noCol?: boolean
}>()
</script>

<template>
  <div
    class="flex bg-background rounded-lg gap-2 shadow-card transition-shadow dark:shadow-card-dark border border-gray-content/10"
    :class="{
      'shadow-card-md dark:shadow-card-md-dark': activation,
      'bg-transparent': noBg,
      'p-0': noPg,
      'p-4': !noPg,
      'flex-col': !noCol,
    }">
    <slot />
  </div>
</template>
