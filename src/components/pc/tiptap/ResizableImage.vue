<template>
  <NodeViewWrapper
    as="div"
    class="relative inline-block leading-none my-4 group"
    :style="{ width: width + 'px' }">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      class="max-h-full w-auto block border" />
    <div
      class="absolute right-[-0.75rem] bottom-[-0.75rem] w-6 h-6 flex items-center justify-center rounded-2xl cursor-nwse-resize z-10 bg-background-content/80"
      @mousedown="startResize"
      @touchstart="startResizeTouch">
      <MoveDiagonal2 class="text-active" :size="18" />
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref, onUnmounted } from 'vue'
import { MoveDiagonal2 } from 'lucide-vue-next'

const props = defineProps(nodeViewProps)
const width = ref(props.node.attrs.width || 400)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

// 鼠标事件处理
function startResize(e: MouseEvent) {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = width.value

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

function handleMouseMove(e: MouseEvent) {
  if (!isResizing.value) return
  const dx = e.clientX - startX.value
  updateWidth(startWidth.value + dx)
}

// 触摸事件处理
function startResizeTouch(e: TouchEvent) {
  isResizing.value = true
  startX.value = e.touches[0].clientX
  startWidth.value = width.value

  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', stopResizeTouch)
  e.preventDefault()
}

function handleTouchMove(e: TouchEvent) {
  if (!isResizing.value) return
  const dx = e.touches[0].clientX - startX.value
  updateWidth(startWidth.value + dx)
  e.preventDefault() // 阻止页面滚动
}

// 通用宽度更新函数
function updateWidth(newWidth: number) {
  width.value = Math.max(100, Math.min(800, newWidth))
}

// 停止调整大小（鼠标）
function stopResize() {
  if (!isResizing.value) return
  isResizing.value = false
  props.updateAttributes({ width: width.value })
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
}

// 停止调整大小（触摸）
function stopResizeTouch() {
  if (!isResizing.value) return
  isResizing.value = false
  props.updateAttributes({ width: width.value })
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', stopResizeTouch)
}

// 组件卸载时清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', stopResizeTouch)
})
</script>

<style scoped>
.resizable-image__handle {
  position: absolute;
  right: -8px;
  bottom: -8px;
  width: 16px;
  height: 16px;
  background: #4299e1;
  border-radius: 50%;
  cursor: nwse-resize;
  z-index: 10;
  touch-action: none; /* 防止触摸事件被浏览器默认处理 */
}
</style>
