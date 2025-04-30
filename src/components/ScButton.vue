<template>
  <button
    :class="[
      'flex items-center justify-center gap-1 text-background-content hover:text-gray',
      { 'p-1': !noPadding },
      { 'bg-transparent': noBg },
      { 'bg-background': !noBg },
      { [activationColor]: activation },
      { 'rounded-md': !noRounded },
    ]"
  >
    <component :is="icon" v-if="icon" :size="iconSize" class="flex-shrink-0" />
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  // ...其他props
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconSize: {
    type: [Number, String],
    default: 16,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  noBg: {
    type: Boolean,
    default: false,
  },
  activation: {
    type: Boolean,
    default: false,
  },
  activationColor: {
    type: String,
    default: 'bg-primary',
  },
  noRounded: {
    type: Boolean,
    default: false,
  },
})
</script>
