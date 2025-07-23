<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useVModel } from '@vueuse/core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import {
  Redo2,
  Undo2,
  SquareCode,
  TextQuote,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  CodeXml,
  Highlighter,
  Subscript,
  Superscript,
  List,
  ListOrdered,
} from 'lucide-vue-next'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import SubscriptE from '@tiptap/extension-subscript'
import SuperscriptE from '@tiptap/extension-superscript'
import Strike from '@tiptap/extension-strike'
import UnderlineE from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import CustomImageExtension from '@/extensions/CustomImageExtension'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'

import { createLowlight } from 'lowlight'
import csharp from 'highlight.js/lib/languages/csharp'

// import Card from '@/components/common/Card.vue'
import ScDivider from '@/components/common/ScDivider.vue'
import ScDropListButtons from '@/components/common/ScDropListButtons.vue'
import ScButton from '@/components/common/ScButton.vue'
import TipTapUploadImage from './TipTapUploadImage.vue'
import { HeadingWithId } from '@/extensions/HeadingWithId'

import { useDeviceStore } from '@/stores/global/deviceStore'

const deviceStore = useDeviceStore()

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  shadow: {
    type: Boolean,
    default: true,
  },
})

const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      // 无序列表
      'Mod-l': () => this.editor.commands.toggleBulletList(),
      // 有序列表
      'Mod-o': () => this.editor.commands.toggleOrderedList(),
      // 下标
      'Mod-[': () => this.editor.commands.toggleSubscript(),
      // 上标
      'Mod-]': () => this.editor.commands.toggleSuperscript(),
      // 图片
      'Mod-Alt-i': () => {
        togglePopup()
        return true
      },
    }
  },
})

const emit = defineEmits(['update:modelValue'])
// 获取设备为Windows还是Mac
const isMac = window.navigator.userAgent.toLowerCase().includes('mac')
const keyboardShortcut = isMac ? '⌘' : 'Ctrl'
const dataTip = {
  Undo: `撤销 ${keyboardShortcut}+Z`,
  Redo: `重做 ${keyboardShortcut}+Y`,
  CodeBlock: `代码块 ${keyboardShortcut}+Alt+C`,
  Code: `行内代码 ${keyboardShortcut}+E`,
  Blockquote: `引用块 ${keyboardShortcut}+Shift+B`,
  Heading: `标题 ${keyboardShortcut}+Alt+数字`,
  Bold: `加粗 ${keyboardShortcut}+B`,
  Italic: `斜体 ${keyboardShortcut}+I`,
  Strikethrough: `删除线 ${keyboardShortcut}+Shift+S`,
  Underline: `下划线 ${keyboardShortcut}+U`,
  Copy: `复制 ${keyboardShortcut}+C`,
  Paste: `粘贴 ${keyboardShortcut}+V`,
  Highlight: `高亮 ${keyboardShortcut}+Shift+H`,
  Subscript: `下标 ${keyboardShortcut}+[`,
  Superscript: `上标 ${keyboardShortcut}+]`,
  LeftAlign: `左对齐 ${keyboardShortcut}+Shift+L`,
  CenterAlign: `居中对齐 ${keyboardShortcut}+Shift+E`,
  RightAlign: `右对齐 ${keyboardShortcut}+Shift+R`,
  JustifyAlign: `对齐全页 ${keyboardShortcut}+Shift+J`,
  OrderedList: `有序列表 ${keyboardShortcut}+O`,
  BulletList: `无序列表 ${keyboardShortcut}+L`,
  Image: `插入图片 ${keyboardShortcut}+Shift+I`,
}

const contentModel = useVModel(props, 'modelValue', emit)

const editor = ref<Editor>()

// watch(
//   () => contentModel.value,
//   (newContent) => {
//     if (!editor.value) return
//     const currentContent = editor.value.getHTML()
//     if (newContent !== currentContent) {
//       editor.value.chain().setContent(newContent, false).run()
//     }
//   },
//   { flush: 'post' }
// )

onMounted(() => {
  const lowlight = createLowlight({
    csharp: csharp, // 只注册 C# 语言
  })

  editor.value = new Editor({
    content: contentModel.value,
    extensions: [
      HeadingWithId.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      CustomBulletList,
      StarterKit.configure({
        heading: false, // 禁用默认 Heading
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Strike.configure({
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
      UnderlineE,
      SubscriptE,
      SuperscriptE,
      CustomImageExtension,
    ],
    // 编辑器更新事件
    onUpdate: () => {
      contentModel.value = editor.value!.getHTML()
    },
    // 失焦事件处理
    onBlur: () => {
      contentModel.value = editor.value!.getHTML()
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const selected = ref('')
const options = [
  { value: 1, label: 'h1' },
  { value: 2, label: 'h2' },
  { value: 3, label: 'h3' },
  { value: 4, label: 'h4' },
  { value: 5, label: 'h5' },
  { value: 6, label: 'h6' },
]
// function copyToClipboard() {
//   if (editor.value) {
//     const content = editor.value.getHTML()
//     navigator.clipboard
//       .writeText(content)
//       .then(() => {
//         console.log('Content copied to clipboard')
//       })
//       .catch((err) => {
//         console.error('Failed to copy content: ', err)
//       })
//   }
// }

const openImagePopup = ref(false)
function togglePopup(value?: string) {
  console.log('openImagePopup', value)

  if (value === 'off') {
    openImagePopup.value = false
  } else {
    openImagePopup.value = !openImagePopup.value
  }
}

function addImg(url: string) {
  if (editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<template>
  <div
    class="w-full overflow-x-hidden"
    :class="{
      'p-4 shadow-xl rounded-xl border border-gray/40':
        deviceStore.device === 2,
    }">
    <div class="flex justify-center items-center flex-wrap gap-1">
      <!-- 撤销 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().undo().run()"
        :disabled="!editor?.can().undo()"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Undo"
        noPd>
        <Undo2 />
      </ScButton>

      <!-- 重做 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().redo().run()"
        :disabled="!editor?.can().redo()"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Redo"
        noPd>
        <Redo2 />
      </ScButton>

      <ScDivider vertical />

      <!-- 标题 下拉选择 -->
      <sc-drop-list-buttons
        v-model="selected"
        :options="options"
        :active="editor?.isActive('heading')"
        class="tooltip p-2"
        :data-tip="dataTip.Heading">
        <template #trigger>
          <Heading1
            v-if="editor?.isActive('heading', { level: 1 })"
            @click="
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            " />
          <Heading2
            v-else-if="editor?.isActive('heading', { level: 2 })"
            @click="
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            " />
          <Heading3
            v-else-if="editor?.isActive('heading', { level: 3 })"
            @click="
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            " />
          <Heading4
            v-else-if="editor?.isActive('heading', { level: 4 })"
            @click="
              editor?.chain().focus().toggleHeading({ level: 4 }).run()
            " />
          <Heading5
            v-else-if="editor?.isActive('heading', { level: 5 })"
            @click="
              editor?.chain().focus().toggleHeading({ level: 5 }).run()
            " />
          <Heading6
            v-else-if="editor?.isActive('heading', { level: 6 })"
            @click="
              editor?.chain().focus().toggleHeading({ level: 6 }).run()
            " />
          <Heading v-else />
        </template>
        <template #h1>
          <ScButton
            :shadow="false"
            size="small"
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            hoverable>
            <Heading1 />
          </ScButton>
        </template>
        <template #h2>
          <ScButton
            :shadow="false"
            size="small"
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            hoverable>
            <Heading2 />
          </ScButton>
        </template>
        <template #h3>
          <ScButton
            :shadow="false"
            size="small"
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            hoverable>
            <Heading3 />
          </ScButton>
        </template>
        <template #h4>
          <ScButton
            :shadow="false"
            size="small"
            @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
            hoverable>
            <Heading4 />
          </ScButton>
        </template>
        <template #h5>
          <ScButton
            :shadow="false"
            size="small"
            @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
            hoverable>
            <Heading5 />
          </ScButton>
        </template>
        <template #h6>
          <ScButton
            :shadow="false"
            size="small"
            @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
            hoverable>
            <Heading6 />
          </ScButton>
        </template>
      </sc-drop-list-buttons>

      <!-- 加粗 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleBold().run()"
        :activation="editor?.isActive('bold')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Bold"
        noPd>
        <Bold />
      </ScButton>

      <!-- 斜体 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleItalic().run()"
        :activation="editor?.isActive('italic')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Italic"
        noPd>
        <Italic />
      </ScButton>

      <!-- 删除线 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleStrike().run()"
        :activation="editor?.isActive('strike')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Strikethrough"
        noPd>
        <Strikethrough />
      </ScButton>

      <!-- 下划线 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleUnderline().run()"
        :activation="editor?.isActive('underline')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Underline"
        noPd>
        <Underline />
      </ScButton>

      <!-- 行内代码 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleCode().run()"
        :activation="editor?.isActive('code')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Code"
        noPd>
        <CodeXml />
      </ScButton>

      <!-- 高亮 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleHighlight().run()"
        :activation="editor?.isActive('highlight')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Highlight"
        noPd>
        <Highlighter />
      </ScButton>

      <!-- 下标 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleSubscript().run()"
        :activation="editor?.isActive('subscript')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Subscript"
        noPd>
        <Subscript />
      </ScButton>

      <!-- 上标 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleSuperscript().run()"
        :activation="editor?.isActive('superscript')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Superscript"
        noPd>
        <Superscript />
      </ScButton>

      <ScDivider vertical />

      <!-- 无序列表 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :activation="editor?.isActive('bulletList')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.BulletList"
        noPd>
        <List />
      </ScButton>
      <!-- 有序列表 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :activation="editor?.isActive('orderedList')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.OrderedList"
        noPd>
        <ListOrdered />
      </ScButton>
      <ScDivider vertical />

      <!-- 图片 -->
      <div class="tooltip p-2" :data-tip="dataTip.Image">
        <TipTapUploadImage @addImg="addImg" />
      </div>

      <!-- 代码块 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="
          editor?.chain().focus().toggleCodeBlock({ language: 'ts' }).run()
        "
        :activation="editor?.isActive('codeBlock')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.CodeBlock"
        noPd>
        <SquareCode />
      </ScButton>

      <!-- 引用块 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :activation="editor?.isActive('blockquote')"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Blockquote"
        noPd>
        <TextQuote />
      </ScButton>

      <ScDivider vertical />

      <!-- 左对齐 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().setTextAlign('left').run()"
        :activation="editor?.isActive({ textAlign: 'left' })"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.LeftAlign"
        noPd>
        <AlignLeft />
      </ScButton>

      <!-- 居中对齐 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().setTextAlign('center').run()"
        :activation="editor?.isActive({ textAlign: 'center' })"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.CenterAlign"
        noPd>
        <AlignCenter />
      </ScButton>

      <!-- 右对齐 -->
      <ScButton
        :shadow="false"
        size="small"
        @click="editor?.chain().focus().setTextAlign('right').run()"
        :activation="editor?.isActive({ textAlign: 'right' })"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.RightAlign"
        noPd>
        <AlignRight />
      </ScButton>

      <!-- 复制内容 -->
      <!-- <ScButton
        :shadow="false"
        size="small"
        @click="copyToClipboard"
        hoverable
        class="tooltip p-2"
        :data-tip="dataTip.Copy"
        noPd>
        <Copy />
      </ScButton> -->
    </div>

    <editor-content :editor="editor" class="tiptapEditor" />
  </div>
</template>
