<template>
  <NodeViewWrapper as="div" class="code-block-container relative">
    <button
      class="absolute top-2 right-2 z-2 border rounded-md px-2 py-1 text-sm bg-gray text-gray-content hover:bg-gray-200 hover:text-active-content transition-colors"
      @click="copyCode">
      <span
        :class="{
          '': copyTip === '复制',
          'text-green-500': copyTip === '复制成功',
        }">
        {{ copyTip }}
      </span>
    </button>

    <!--  关键：用 NodeViewContent 把内容还给 ProseMirror -->
    <NodeViewContent as="pre" class="language-" />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import {
  type NodeViewProps,
  NodeViewWrapper,
  NodeViewContent,
} from '@tiptap/vue-3'
import { computed, ref } from 'vue'
const props = defineProps<NodeViewProps>()
const code = computed(() => props.node.textContent || '')
const copyTip = ref('复制')
const copyCode = () => {
  navigator.clipboard.writeText(code.value)
  copyTip.value = '复制成功'
  setTimeout(() => {
    copyTip.value = '复制'
  }, 2000)
}
</script>
