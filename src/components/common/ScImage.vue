<template>
  <div>
    {{ src }}
    <img
      v-if="!loadError"
      class="w-full h-full object-cover"
      :src="formatLink(src)"
      :alt="alt"
      @error="loadError = true" />
    <img
      v-else
      class="w-full h-full object-cover"
      :src="configStore.errorImg"
      :alt="alt" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { formatLink } from '@/hook/format'
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()

defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
})
const loadError = ref(false)
</script>
