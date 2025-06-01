<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="[
        'w-full px-4 py-2 rounded-md border transition-colors duration-200',
        'focus:outline-none focus:ring-1 focus:border-opacity-70',
        borderColor,
        focusBorderColor,
        error ? 'border-error' : '',
      ]" />
    <span v-if="error" class="absolute -bottom-5 left-0 text-xs text-error">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  borderColor?: string
  focusBorderColor?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  borderColor: 'border-gray-300',
  focusBorderColor: 'focus:border-blue-300 focus:ring-blue-200',
  error: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
