<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  activation: { type: Boolean, default: false },
  noPg: { type: Boolean, default: false },
  noBg: { type: Boolean, default: false },
  noCol: { type: Boolean, default: false },
  noShadow: { type: Boolean, default: false },
  Borlder: { type: Boolean, default: true },
})
</script>

<template>
  <div
    class="flex bg-background rounded-lg gap-2"
    :class="{
      'shadow-card-md ': activation,
      'bg-transparent': noBg,
      'p-0': noPg,
      'p-4': !noPg,
      'flex-col': !noCol,
      'shadow-card transition-shadow ': !noShadow,
      'border border-gray-content/10': Borlder,
    }">
    <slot />
  </div>
</template>
