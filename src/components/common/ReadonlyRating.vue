<template>
  <div :class="['rating', sizeClass, { 'pointer-events-none': readonly }]">
    <template v-for="star in 5" :key="star">
      <input
        type="radio"
        :value="star"
        :name="uniqueName"
        class="mask mask-star"
        :class="[props.colorClass]"
        :checked="isChecked(star)"
        :disabled="readonly"
        @change="handleChange(star)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  colorClass: {
    type: String,
    default: 'bg-yellow-500',
  },
  size: {
    type: String,
    default: 'sm',
    validator: (v: string) => ['xs', 'sm', 'md', 'lg'].includes(v),
  },
  readonly: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:value'])

const uniqueName = `rating-int-${Math.random().toString(36).substring(2, 10)}`

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'rating-xs'
    case 'sm':
      return 'rating-sm'
    case 'lg':
      return 'rating-lg'
    default:
      return 'rating-md'
  }
})

const isChecked = (v: number) => v === props.value

const handleChange = (newValue: number) => {
  if (!props.readonly) {
    emit('update:value', newValue)
  }
}
</script>
