<template>
  <div
    ref="container"
    class="relative flex rounded-md border border-gray bg-background flex-shrink-0">
    <div
      class="absolute h-full rounded-[5px] bg-active transition-all flex-shrink-0"
      :style="highlightStyle"></div>
    <div
      v-for="option in options"
      :key="option.value"
      ref="optionItems"
      class="relative z-1 flex-1 px-4 py-2 text-center cursor-pointer select-none flex-shrink-0"
      :class="{
        'text-active-content': modelValue === option.value,
      }"
      @click="handleSelect(option.value)">
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

interface Option {
  value: number | string
  label: string
}

const props = defineProps<{
  options: Option[]
  modelValue: number | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const container = ref<HTMLElement>()
const optionItems = ref<HTMLElement[]>([])
const highlightStyle = ref({
  width: '0px',
  left: '0px',
})

const handleSelect = (value: number | string) => {
  emit('update:modelValue', value)
}

const updateHighlightPosition = () => {
  nextTick(() => {
    if (!container.value || !optionItems.value.length) return

    const activeIndex = props.options.findIndex(
      (option) => option.value === props.modelValue
    )
    if (activeIndex === -1) return

    const activeElement = optionItems.value[activeIndex]
    if (!activeElement) return

    const { left: containerLeft } = container.value.getBoundingClientRect()
    const { width, left } = activeElement.getBoundingClientRect()

    highlightStyle.value = {
      width: `${width}px`,
      left: `${left - containerLeft - 1}px`,
    }
  })
}

onMounted(() => {
  updateHighlightPosition()
  window.addEventListener('resize', updateHighlightPosition)
})

watch(() => props.modelValue, updateHighlightPosition)
watch(() => props.options, updateHighlightPosition, { deep: true })
</script>
