<template>
  <div
    ref="container"
    class="w-full h-full overflow-hidden flex justify-center items-center touch-none select-none"
    @wheel.prevent="handleWheel"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @touchstart="startTouch"
    @touchmove="onTouchMove"
    @touchend="endDrag"
    @dblclick="resetTransform"
    @click="handleClickOutside">
    <img
      ref="imgRef"
      :src="src"
      :alt="$t('t.tu-pian-yu-lan')"
      @dblclick.prevent
      @mousedown.prevent
      :draggable="false"
      class="select-none w-auto h-full object-contain z-10"
      :style="mergedStyle"
      @load="onImageLoad"
      @click.stop />
  </div>
</template>

<script setup lang="ts">
import { useDeviceStore } from '@/stores/global/deviceStore'
import { ref, computed } from 'vue'

const deviceStore = useDeviceStore()

defineProps<{
  src: string
}>()

const emit = defineEmits<{
  (e: 'click-outside'): void
}>()

// 缩放与平移状态
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)

// 拖动状态
const isDragging = ref(false)
const lastX = ref(0)
const lastY = ref(0)

const imgRef = ref<HTMLImageElement | null>(null)
const container = ref<HTMLElement | null>(null)

// 触控缩放状态
const lastTouchDistance = ref<number | null>(null)

const fitMode = ref<'fit-width' | 'fit-height'>('fit-width') // 自适应模式

const mergedStyle = computed(() => {
  const baseTransform = `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`
  const fitSizeStyle =
    fitMode.value === 'fit-width'
      ? { maxWidth: deviceStore.device == 1 ? '100vw' : '90vw', height: 'auto' }
      : {
          maxHeight: deviceStore.device == 1 ? '100dvh' : '90dvh',
          width: 'auto',
        }

  return {
    transform: baseTransform,
    transition: isDragging.value ? 'none' : 'transform 0.2s ease',
    ...fitSizeStyle,
  }
})

const handleClickOutside = () => {
  // 如果点击的是 container 而不是 img，说明是“外部区域”
  emit('click-outside')
}

const onImageLoad = () => {
  if (!imgRef.value || !container.value) return

  const imgWidth = imgRef.value.naturalWidth
  const imgHeight = imgRef.value.naturalHeight

  const containerWidth = container.value.clientWidth
  const containerHeight = container.value.clientHeight

  const imgRatio = imgWidth / imgHeight
  const containerRatio = containerWidth / containerHeight

  // 决定用哪种方式适配
  fitMode.value = imgRatio > containerRatio ? 'fit-width' : 'fit-height'

  // 重置变换
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 滚轮缩放
const handleWheel = (event: WheelEvent) => {
  const delta = -event.deltaY
  const step = 0.1
  const newScale = scale.value + (delta > 0 ? step : -step)
  scale.value = Math.min(Math.max(newScale, 0.2), 5)
}

// 鼠标拖动
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  lastX.value = event.clientX
  lastY.value = event.clientY
}
const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  const dx = event.clientX - lastX.value
  const dy = event.clientY - lastY.value
  translateX.value += dx
  translateY.value += dy
  lastX.value = event.clientX
  lastY.value = event.clientY
}
const endDrag = () => {
  isDragging.value = false
  lastTouchDistance.value = null
}

// 触摸拖动和缩放
const startTouch = (event: TouchEvent) => {
  if (event.touches.length === 1) {
    isDragging.value = true
    lastX.value = event.touches[0].clientX
    lastY.value = event.touches[0].clientY
  } else if (event.touches.length === 2) {
    isDragging.value = false
    lastTouchDistance.value = getTouchDistance(event.touches)
  }
}

const onTouchMove = (event: TouchEvent) => {
  if (event.touches.length === 1 && isDragging.value) {
    const dx = event.touches[0].clientX - lastX.value
    const dy = event.touches[0].clientY - lastY.value
    translateX.value += dx
    translateY.value += dy
    lastX.value = event.touches[0].clientX
    lastY.value = event.touches[0].clientY
  } else if (event.touches.length === 2) {
    const newDistance = getTouchDistance(event.touches)
    if (lastTouchDistance.value !== null) {
      const delta = newDistance - lastTouchDistance.value
      const step = delta / 200 // 控制缩放速度
      const newScale = scale.value + step
      scale.value = Math.min(Math.max(newScale, 0.2), 5)
    }
    lastTouchDistance.value = newDistance
  }
}

// 双击重置
const resetTransform = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 获取两个触点间的距离
const getTouchDistance = (touches: TouchList): number => {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}
</script>

<style scoped>
img {
  user-select: none;
  -webkit-user-drag: none;
  max-width: none;
  max-height: none;
}
</style>
