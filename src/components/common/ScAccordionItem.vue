<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = ref(props.open)
const contentRef = ref<HTMLElement | null>(null)

watch(
  () => props.open,
  async (val) => {
    isOpen.value = val
    await nextTick()
    animate(val)
  },
  { immediate: true }
)

const toggle = () => emit('update:open', !isOpen.value)

const animate = (expand: boolean) => {
  const el = contentRef.value
  if (!el) return

  el.style.overflow = 'hidden'

  if (expand) {
    el.style.height = '0px'
    const fullHeight = el.scrollHeight + 'px'
    requestAnimationFrame(() => {
      el.style.transition = 'height 0.2s ease'
      el.style.height = fullHeight
    })
  } else {
    el.style.height = el.scrollHeight + 'px'
    requestAnimationFrame(() => {
      el.style.transition = 'height 0.2s ease'
      el.style.height = '0px'
    })
  }

  el.addEventListener(
    'transitionend',
    () => {
      el.style.transition = ''
      el.style.height = expand ? 'auto' : '0px'
      el.style.overflow = expand ? 'visible' : 'hidden'
    },
    { once: true }
  )
}
</script>

<template>
  <div class="w-full">
    <!-- 标题 -->
    <button
      @click="toggle"
      class="w-full flex items-center justify-between px-2 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <slot name="title" />
      <ChevronRight
        :class="[
          'w-4 h-4 transform transition-transform duration-300',
          isOpen ? 'rotate-90' : 'rotate-0',
        ]" />
    </button>

    <!-- 内容 -->
    <div ref="contentRef" class="px-2 overflow-hidden h-0">
      <slot name="content" />
    </div>
  </div>
</template>
