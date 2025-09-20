<template>
  <div
    ref="container"
    class="relative rounded-md border border-gray bg-background flex-shrink-0"
    :class="[col ? 'flex-col' : 'flex']">
    <div
      class="absolute rounded-[5px] bg-active transition-all flex-shrink-0"
      :style="highlightStyle"></div>
    <div
      v-for="option in options"
      :key="option.value"
      ref="optionItems"
      class="relative z-1 px-4 py-2 cursor-pointer select-none flex-shrink-0"
      :class="{
        'text-active-content': modelValue === option.value,
        'text-center': !col,
        'text-left': col,
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

const props = withDefaults(
  defineProps<{
    options: Option[]
    modelValue: number | string
    col?: boolean // 新增垂直布局参数
  }>(),
  {
    col: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const container = ref<HTMLElement>()
const optionItems = ref<HTMLElement[]>([])
const highlightStyle = ref({
  width: '0px',
  height: '0px',
  left: '0px',
  top: '0px',
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

    const containerRect = container.value.getBoundingClientRect()
    const elementRect = activeElement.getBoundingClientRect()

    if (props.col) {
      // 垂直布局样式
      highlightStyle.value = {
        width: `${containerRect.width - 2}px`,
        height: `${elementRect.height}px`,
        left: '0px',
        top: `${elementRect.top - containerRect.top - 1}px`,
      }
    } else {
      // 水平布局样式
      highlightStyle.value = {
        width: `${elementRect.width}px`,
        height: `${containerRect.height - 2}px`,
        left: `${elementRect.left - containerRect.left - 1}px`,
        top: '0px',
      }
    }
  })
}

onMounted(() => {
  updateHighlightPosition()
  window.addEventListener('resize', updateHighlightPosition)
})

watch(() => props.modelValue, updateHighlightPosition)
watch(() => props.options, updateHighlightPosition, { deep: true })
watch(() => props.col, updateHighlightPosition)
</script>
