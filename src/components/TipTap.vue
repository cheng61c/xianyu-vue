<template>
  <div>
    <!-- Tiptap 编辑器 -->
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Editor } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { TextAlign } from '@tiptap/extension-text-align'

const editor = useEditor({
  extensions: [
    StarterKit, // 默认的基本扩展，包含常见的文本格式化功能
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  content: '<p>初始内容</p>',
})

onMounted(() => {
  if (editor.value) {
    // 编辑器已初始化，可以在这里进行其他设置
  }
})
</script>

<style scoped>
/* 你可以自定义样式 */
</style>
