<script setup lang="ts">
import { computed, useAttrs, reactive } from 'vue'
import type { CSSProperties } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const props = defineProps({
  shadow: {
    type: Boolean,
    default: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  inCard: {
    type: Boolean,
    default: false,
  },
  background: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: true,
  },
  noMargin: {
    type: Boolean,
    default: false,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
})

const themeStore = useThemeStore()

const a = { a: 1 }
const b = reactive(a)
const c = reactive(a)
console.log(b === c)

const attrs = useAttrs()
const hasClickEvent = computed(() => !!attrs.onClick)

const scCardMainStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  border: props.border ? '1px solid #cccccc99' : undefined,
  padding: props.inCard ? '0' : props.compact ? '0.25rem' : '1rem',
  width: '100%',
  marginTop: props.noMargin ? '0' : props.compact ? '0.25rem' : '0.75rem',
  marginBottom: props.noMargin ? '0' : props.compact ? '0.25rem' : '0.75rem',
  backgroundColor: props.background ? themeStore.colors.background : undefined,
}
</script>

<template>
  <div
    :class="[
      {
        hasClickEvent,
        neumorphism: props.shadow,
      },
    ]"
    :style="scCardMainStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.hasClickEvent:hover {
  transition: box-shadow 0.25s ease;
  box-shadow:
    inset 10px 10px 20px rgba(0, 0, 0, 0.05),
    inset 5px 5px 10px rgba(0, 0, 0, 0.2),
    inset 2px 2px 4px rgba(0, 0, 0, 0.05),
    inset -10px -10px 20px rgba(255, 255, 255, 0.5),
    inset -5px -5px 10px rgba(255, 255, 255, 0.5),
    inset -2px -2px 4px rgba(255, 255, 255, 0.5);

  &:before {
    box-shadow: none;
  }
}
</style>
