<template>
  <!-- 使用单一的 NodeViewContent 让编辑器自己渲染表格内部内容，避免把所有内容挂载到第一个 cell -->
  <NodeViewWrapper as="div" class="w-full relative">
    <button
      class="absolute top-3 right-[-10px] z-2 rounded-full flex justify-center items-center w-6 h-6 bg-background border border-gray text-gray-content hover:bg-gray-200 transition-colors"
      @click="addCol">
      +
    </button>

    <button
      class="absolute top-[38px] left-[-10px] z-2 rounded-full flex justify-center items-center w-6 h-6 bg-background border border-gray text-gray-content hover:bg-gray-200 transition-colors"
      @click="addRow">
      +
    </button>

    <div
      class="tableWrapper"
      ref="wrapperRef"
      @contextmenu.prevent="onContextMenu">
      <NodeViewContent as="table" class="w-full table-auto border-collapse" />

      <div
        v-if="menuVisible"
        ref="menuRef"
        :style="{ left: menuX + 'px', top: menuY + 'px' }"
        class="absolute z-50 bg-white border rounded shadow p-2">
        <button
          class="block w-full text-left px-2 py-1 hover:bg-gray-100"
          @click="addRow">
          添加行
        </button>
        <button
          class="block w-full text-left px-2 py-1 hover:bg-gray-100"
          @click="addCol">
          添加列
        </button>

        <button
          class="block w-full text-left px-2 py-1 hover:bg-gray-100"
          @click="deleteRow">
          删除行
        </button>

        <button
          class="block w-full text-left px-2 py-1 hover:bg-gray-100"
          @click="deleteTable">
          删除表格
        </button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()

import { ref, onBeforeUnmount } from 'vue'

const wrapperRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)

const addRow = () => {
  props.editor?.chain()?.focus()?.addRowAfter()?.run()
  hideMenu()
}

const addCol = () => {
  props.editor?.chain()?.focus()?.addColumnAfter()?.run()
  hideMenu()
}

const deleteRow = () => {
  // 调用表格删除行命令（如果你的表格扩展支持）
  try {
    props.editor?.chain()?.focus()?.deleteRow()?.run()
  } catch (e) {
    console.warn('deleteRow command not available', e)
  }
  hideMenu()
}

const deleteTable = () => {
  props.editor?.chain().focus().deleteTable().run()
  hideMenu()
}

const hideMenu = () => {
  menuVisible.value = false
}

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect()
    menuX.value = e.clientX - rect.left // 相对于元素的X坐标
    menuY.value = e.clientY - rect.top // 相对于元素的Y坐标
  } else {
    menuX.value = e.clientX
    menuY.value = e.clientY
  }

  console.log(menuX.value, menuY.value)

  menuVisible.value = true
}

const onDocClick = (e: MouseEvent) => {
  // 只有当菜单打开时才关心点击事件
  if (!menuVisible.value) return
  const target = e.target as Node
  // 如果点击不在菜单内部，则关闭菜单
  if (!menuRef.value || !menuRef.value.contains(target)) {
    hideMenu()
  }
}

document.addEventListener('click', onDocClick)

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>
