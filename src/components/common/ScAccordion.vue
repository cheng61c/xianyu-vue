<script setup lang="ts">
import { provide, ref } from 'vue'

const props = defineProps<{
  multiple?: boolean // 是否允许多个同时展开
}>()

const openItems = ref<Set<string>>(new Set())

const toggleItem = (key: string) => {
  if (props.multiple) {
    if (openItems.value.has(key)) openItems.value.delete(key)
    else openItems.value.add(key)
  } else {
    openItems.value = openItems.value.has(key) ? new Set() : new Set([key])
  }
}

const isOpen = (key: string) => openItems.value.has(key)

provide('accordionContext', {
  isOpen,
  toggleItem,
})
</script>

<template>
  <div class="space-y-2">
    <slot />
  </div>
</template>
