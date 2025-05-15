<template>
  <NodeViewWrapper
    as="div"
    class="relative inline-block leading-none my-4 group"
    :style="{ width: width + 'px' }">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      class="max-h-full w-auto block border border-transparent group-hover:border-background-content" />
    <div
      class="absolute right-[-0.25rem] bottom-[-0.25rem] w-2 h-2 bg-none cursor-nwse-resize z-10 group-hover:bg-background-content"
      @mousedown="startResize"></div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref, onUnmounted } from 'vue'

const props = defineProps(nodeViewProps)
const width = ref(props.node.attrs.width || 400)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

function startResize(e: { clientX: number; preventDefault: () => void }) {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = width.value

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

function handleMouseMove(e: { clientX: number }) {
  if (!isResizing.value) return
  const dx = e.clientX - startX.value
  width.value = Math.max(100, Math.min(800, startWidth.value + dx))
}

function stopResize() {
  isResizing.value = false
  props.updateAttributes({ width: width.value })
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style>
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
}
</style>
