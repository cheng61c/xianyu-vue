<template>
  <div class="flex gap-4 items-center py-2">
    <div>
      <h2 class="text-md font-semibold text-active-content">
        {{ title }}
      </h2>
      <p class="text-active-content">
        {{ prompt }}
      </p>
    </div>
    <ScButton @click="$emit('clickToResources')" class="mt-2" Border>
      {{ btnText }}
    </ScButton>
  </div>
</template>

<script setup lang="ts">
import ScButton from './ScButton.vue'

defineProps<{
  title: string
  prompt: string
  btnText: string
  postId?: string
}>()
</script>
