<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = defineProps<{
  vertical?: boolean
}>()

const ScDividerStyle: CSSProperties = {
  width: props.vertical ? '1px' : undefined,
  height: props.vertical ? undefined : '1px',
  margin: '4px',
  backgroundColor: '#cccccc99',
  flexShrink: 0,
  alignSelf: 'stretch',
}
</script>

<template>
  <div :style="ScDividerStyle"></div>
</template>
