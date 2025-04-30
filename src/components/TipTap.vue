<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
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
  AlignJustify,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  CodeXml,
  Highlighter,
  Subscript,
  Superscript,
  Copy,
} from 'lucide-vue-next'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import SubscriptE from '@tiptap/extension-subscript'
import SuperscriptE from '@tiptap/extension-superscript'
import Strike from '@tiptap/extension-strike'
import UnderlineE from '@tiptap/extension-underline'
import CodeBlock from '@tiptap/extension-code-block'

import Card from './Card.vue'
import ScDivider from './ScDivider.vue'
import ScDropListButtons from './ScDropListButtons.vue'
import ScButton from './ScButton.vue'

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

const emit = defineEmits(['update:modelValue'])

const contentModel = useVModel(props, 'modelValue', emit)

const editor = ref<Editor>()

watch(
  () => contentModel.value,
  (newContent) => {
    if (!editor.value) return
    const currentContent = editor.value.getHTML()
    if (newContent !== currentContent) {
      editor.value.chain().setContent(newContent, false).run()
    }
  },
  { flush: 'post' }
)

onMounted(() => {
  editor.value = new Editor({
    content: contentModel.value,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
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
      CodeBlock.configure({
        languageClassPrefix: 'language-',
      }),
      SubscriptE,
      SuperscriptE,
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
function copyToClipboard() {
  if (editor.value) {
    const content = editor.value.getHTML()
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log('Content copied to clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy content: ', err)
      })
  }
}
</script>

<template>
  <Card>
    <Card>
      <div class="flex justify-center items-center flex-wrap gap-1 p-1">
        <!-- 撤销 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().undo()"
          hoverable
        >
          <Undo2 />
        </ScButton>

        <!-- 重做 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().redo()"
          hoverable
        >
          <Redo2 />
        </ScButton>

        <ScDivider vertical />

        <!-- 代码块 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          :activation="editor?.isActive('codeBlock')"
          hoverable
        >
          <SquareCode />
        </ScButton>

        <!-- 引用块 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :activation="editor?.isActive('blockquote')"
          hoverable
        >
          <TextQuote />
        </ScButton>

        <ScDivider vertical />

        <!-- 标题 下拉选择 -->
        <sc-drop-list-buttons
          v-model="selected"
          :options="options"
          :activation="editor?.isActive('heading')"
        >
          <details class="dropdown">
            <summary class="btn m-1">open or close</summary>
          </details>
          <template #trigger>
            <Heading1
              v-if="editor?.isActive('heading', { level: 1 })"
              @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            />
            <Heading2
              v-else-if="editor?.isActive('heading', { level: 2 })"
              @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            />
            <Heading3
              v-else-if="editor?.isActive('heading', { level: 3 })"
              @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            />
            <Heading4
              v-else-if="editor?.isActive('heading', { level: 4 })"
              @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
            />
            <Heading5
              v-else-if="editor?.isActive('heading', { level: 5 })"
              @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
            />
            <Heading6
              v-else-if="editor?.isActive('heading', { level: 6 })"
              @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
            />
            <Heading v-else />
          </template>
          <template #h1>
            <ScButton
              :shadow="false"
              size="small"
              @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
              hoverable
            >
              <Heading1 />
            </ScButton>
          </template>
          <template #h2>
            <ScButton
              :shadow="false"
              size="small"
              @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
              hoverable
            >
              <Heading2 />
            </ScButton>
          </template>
          <template #h3>
            <ScButton
              :shadow="false"
              size="small"
              @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
              hoverable
            >
              <Heading3 />
            </ScButton>
          </template>
          <template #h4>
            <ScButton
              :shadow="false"
              size="small"
              @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
              hoverable
            >
              <Heading4 />
            </ScButton>
          </template>
          <template #h5>
            <ScButton
              :shadow="false"
              size="small"
              @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
              hoverable
            >
              <Heading5 />
            </ScButton>
          </template>
          <template #h6>
            <ScButton
              :shadow="false"
              size="small"
              @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
              hoverable
            >
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
        >
          <Bold />
        </ScButton>

        <!-- 斜体 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleItalic().run()"
          :activation="editor?.isActive('italic')"
          hoverable
        >
          <Italic />
        </ScButton>

        <!-- 删除线 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleStrike().run()"
          :activation="editor?.isActive('strike')"
          hoverable
        >
          <Strikethrough />
        </ScButton>

        <!-- 下划线 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleUnderline().run()"
          :activation="editor?.isActive('underline')"
          hoverable
        >
          <Underline />
        </ScButton>

        <!-- 行内代码 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleCode().run()"
          :activation="editor?.isActive('code')"
          hoverable
        >
          <CodeXml />
        </ScButton>

        <!-- 高亮 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleHighlight().run()"
          :activation="editor?.isActive('highlight')"
          hoverable
        >
          <Highlighter />
        </ScButton>

        <!-- 下标 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleSubscript().run()"
          :activation="editor?.isActive('subscript')"
          hoverable
        >
          <Subscript />
        </ScButton>

        <!-- 上标 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().toggleSuperscript().run()"
          :activation="editor?.isActive('superscript')"
          hoverable
        >
          <Superscript />
        </ScButton>

        <ScDivider vertical />

        <!-- 左对齐 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().setTextAlign('left').run()"
          :activation="editor?.isActive({ textAlign: 'left' })"
          hoverable
        >
          <AlignLeft />
        </ScButton>

        <!-- 居中对齐 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().setTextAlign('center').run()"
          :activation="editor?.isActive({ textAlign: 'center' })"
          hoverable
        >
          <AlignCenter />
        </ScButton>

        <!-- 右对齐 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().setTextAlign('right').run()"
          :activation="editor?.isActive({ textAlign: 'right' })"
          hoverable
        >
          <AlignRight />
        </ScButton>

        <!-- 等距对齐 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().setTextAlign('justify').run()"
          hoverable
        >
          <AlignJustify />
        </ScButton>

        <!-- 复制内容 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="copyToClipboard"
          hoverable
        >
          <Copy />
        </ScButton>
      </div>
    </Card>

    <editor-content :editor="editor" class="tiptapEditor" />
  </Card>
</template>
