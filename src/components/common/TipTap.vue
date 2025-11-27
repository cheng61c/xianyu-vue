<template>
  <div class="tiptap-editor">
    <!-- 工具栏 -->
    <div class="toolbar flex gap-2 mb-2 flex-wrap p-2">
      <!-- 撤回 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="undo"
        :icon="Undo"
        :iconSize="22"></ScButton>
      <!-- 重做 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="redo"
        :icon="Redo"
        :iconSize="22"></ScButton>

      <!-- 加粗 -->
      <ScButton
        bgClass="bg-gray/20"
        :activation="editor?.isActive('bold')"
        @click="toggleBold"
        :icon="Bold"
        :iconSize="22">
      </ScButton>
      <!-- 斜体 -->
      <ScButton
        bgClass="bg-gray/20"
        :activation="editor?.isActive('italic')"
        @click="toggleItalic"
        :icon="Italic"
        :iconSize="22">
      </ScButton>
      <!-- 下划线 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="toggleUnderline"
        :activation="editor?.isActive('underline')"
        :icon="Underline"
        :iconSize="22">
      </ScButton>
      <!-- 标题 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="setHeading(1)"
        :activation="editor?.isActive('heading', { level: 1 })"
        :icon="Heading1"
        :iconSize="22">
      </ScButton>
      <!-- 标题2 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="setHeading(2)"
        :activation="editor?.isActive('heading', { level: 2 })"
        :icon="Heading2"
        :iconSize="22">
      </ScButton>
      <!-- 列表 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="toggleBulletList"
        :activation="editor?.isActive('bulletList')"
        :icon="List"
        :iconSize="22">
      </ScButton>
      <!-- 有序列表 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="toggleOrderedList"
        :activation="editor?.isActive('orderedList')"
        :icon="ListOrdered"
        :iconSize="22">
      </ScButton>
      <!-- 引用 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="toggleBlockquote"
        :activation="editor?.isActive('blockquote')"
        :icon="Quote"
        :iconSize="22">
      </ScButton>
      <!-- 代码块 -->
      <ScButton
        bgClass="bg-gray/20"
        :activation="editor?.isActive('codeBlock')">
        <SquareCode @click="toggleCodeBlock" />

        <!-- 在工具栏添加语言选择器 -->
        <select
          v-if="editor?.isActive('codeBlock')"
          v-model="currentLanguage"
          @change="setCodeBlockLanguage"
          class="ml-2 bg-transparent border-none outline-none">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="python">Python</option>
          <option value="csharp">C#</option>
        </select>
      </ScButton>

      <!-- 表格 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="insertTable"
        :activation="editor?.isActive('table')"
        :icon="Table2"
        :iconSize="22">
      </ScButton>

      <!-- 图片上传 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="triggerFileInput"
        :icon="ImageUp"
        :iconSize="22">
        <!-- 推荐写法 -->
        <input
          type="file"
          multiple
          accept="image/*"
          @change="onImageUpload"
          class="hidden"
          ref="fileInput" />
      </ScButton>

      <!-- 链接 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="openLinkDialog"
        :activation="editor?.isActive('link')"
        :icon="Link2"
        :iconSize="22">
      </ScButton>
      <!-- 链接输入弹窗 -->
      <ScModal
        v-model="showLinkDialog"
        class="fixed z-50 border p-4 rounded shadow">
        <Card>
          <ScInput v-model="linkUrl" placeholder="请输入链接地址" />
          <ScButton Border @click="setLink">确定</ScButton>
          <ScButton Border @click="closeLinkDialog">取消</ScButton>
        </Card>
      </ScModal>

      <!-- 视频 -->
      <ScButton
        bgClass="bg-gray/20"
        @click="openVideoDialog"
        :icon="Video"
        :iconSize="22">
      </ScButton>
      <!-- 视频输入弹窗 -->
      <ScModal
        v-model="showVideoDialog"
        class="fixed z-50 border p-4 rounded shadow">
        <Card>
          <ScInput v-model="videoUrl" placeholder="请输入视频链接" />
          <ScButton Border @click="insertVideo">确定</ScButton>
          <ScButton Border @click="closeVideoDialog">取消</ScButton>
        </Card>
      </ScModal>
    </div>
    <!-- 编辑器主体 -->
    <EditorContent :editor="editor" class="editor-content" />
    <!-- 气泡菜单 -->
    <BubbleMenu
      v-if="editor && !editor.isActive('imageResize')"
      :editor="editor"
      :tippyOptions="{ duration: 100 }">
      <Card class="flex gap-1 w-full">
        <div class="flex gap-1 w-full flex-wrap">
          <ScButton
            bgClass="bg-gray/20"
            :activation="editor?.isActive('bold')"
            @click="toggleBold"
            :icon="Bold">
          </ScButton>
          <ScButton
            bgClass="bg-gray/20"
            :activation="editor?.isActive('italic')"
            @click="toggleItalic"
            :icon="Italic">
          </ScButton>
          <ScButton
            bgClass="bg-gray/20"
            @click="toggleUnderline"
            :activation="editor?.isActive('underline')"
            :icon="Underline">
          </ScButton>
          <ScButton
            bgClass="bg-gray/20"
            @click="openLinkDialog"
            :activation="editor?.isActive('link')"
            :icon="Link2">
          </ScButton>
          <!-- 添加颜色选择按钮 -->
          <ScButton
            bgClass="bg-gray/20"
            @click="() => editor?.chain().focus().setColor('#FF0000').run()"
            :icon="PaintRoller">
          </ScButton>
          <ScButton
            bgClass="bg-gray/20"
            @click="
              () =>
                editor?.chain().focus().setHighlight({ color: '#FFFF00' }).run()
            "
            :icon="HighlighterIcon">
          </ScButton>

          <template v-if="editor?.isActive('table')">
            <ScButton bgClass="bg-gray/20 " @click="mergeCells">合并</ScButton>
          </template>
        </div>
      </Card>
    </BubbleMenu>
    <!-- 斜杠命令菜单 -->
    <!-- <SlashCommand v-if="editor" :editor="editor" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Editor,
  EditorContent,
  BubbleMenu,
  VueNodeViewRenderer,
} from '@tiptap/vue-3'
import CodeBlockView from './tiptap/CodeBlockView.vue'
import TableView from './tiptap/TableView.vue'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import BlockquoteExtension from '@tiptap/extension-blockquote'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Video as VideoExtensions } from '@/extensions/video'
// 图片插入扩展
import ResizableImage from 'tiptap-extension-resize-image'
import { Dropcursor } from '@tiptap/extension-dropcursor'

// 代码高亮相关
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import csharp from 'highlight.js/lib/languages/csharp'
import 'highlight.js/styles/github-dark.css' // 可换其他主题

import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'

import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  SquareCode,
  Underline,
  Quote,
  Table2,
  Undo,
  Redo,
  ImageUp,
  Video,
  HighlighterIcon,
  PaintRoller,
} from 'lucide-vue-next'

// 注册语言
const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('python', python)
lowlight.register('csharp', csharp)

import { uploadApi } from '@/apis'
import Card from './Card.vue'
import ScButton from './ScButton.vue'
import { formatLink } from '@/utils/format'
import ScModal from './ScModal.vue'
import ScInput from './ScInput.vue'

const editor = ref<Editor>()
const fileInput = ref<HTMLInputElement | null>(null)
const currentLanguage = ref('javascript')
const showLinkDialog = ref(false)
const linkUrl = ref('')
const showVideoDialog = ref(false)
const videoUrl = ref('')
/** 图片地址映射 */
const imageUrls = ref<{ [key: string]: string }>({})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onImageUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return
  for (const file of Array.from(files)) {
    // 上传图片
    const res = await uploadApi.uploadFileChunked(file, 6)
    const url = formatLink(res.data.data?.url)
    const filePath = URL.createObjectURL(file)
    imageUrls.value[filePath] = res.data.data?.url

    if (url) {
      // 插入本地地址的图片用于显示
      editor.value?.chain().focus().setImage({ src: filePath }).run()
    }
  }
  ;(e.target as HTMLInputElement).value = ''
}

/**
 * 上传图片, 完事后返回本地连接用于插入到文章
 * @param file 图片文件
 * @return 本地连接
 */
const uploadImages = async (file: File): Promise<string> => {
  const res = await uploadApi.uploadFileChunked(file, 6)
  const url = formatLink(res.data.data?.url)
  const filePath = URL.createObjectURL(file)
  imageUrls.value[filePath] = url
  return filePath
}

const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
const toggleUnderline = () =>
  editor.value?.chain().focus().toggleUnderline().run()
const setHeading = (level: 1 | 2 | 3) =>
  editor.value?.chain().focus().toggleHeading({ level }).run()
const toggleBulletList = () =>
  editor.value?.chain().focus().toggleBulletList().run()
const toggleOrderedList = () =>
  editor.value?.chain().focus().toggleOrderedList().run()
const toggleBlockquote = () =>
  editor.value?.chain().focus().toggleBlockquote().run()
const toggleCodeBlock = () =>
  editor.value?.chain().focus().toggleCodeBlock().run()
const insertTable = () => {
  editor.value
    ?.chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}
const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()
// const addRowAfter = () => editor.value?.chain().focus().addRowAfter().run()
// const addColumnAfter = () =>
//   editor.value?.chain().focus().addColumnAfter().run()
// const deleteRow = () => editor.value?.chain().focus().deleteRow().run()
// const deleteColumn = () => editor.value?.chain().focus().deleteColumn().run()
// const deleteTable = () => editor.value?.chain().focus().deleteTable().run()
const mergeCells = () => {
  editor.value?.chain().focus().mergeCells().run()
}

const setCodeBlockLanguage = () => {
  editor.value
    ?.chain()
    .focus()
    .setNode('codeBlock', { language: currentLanguage.value })
    .run()
}
const openLinkDialog = () => {
  showLinkDialog.value = true
  linkUrl.value = ''
}
const closeLinkDialog = () => {
  showLinkDialog.value = false
}
const setLink = () => {
  if (linkUrl.value) {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl.value })
      .run()
  }
  closeLinkDialog()
}
const openVideoDialog = () => {
  showVideoDialog.value = true
  videoUrl.value = ''
}
const closeVideoDialog = () => {
  showVideoDialog.value = false
}
const insertVideo = () => {
  if (videoUrl.value) {
    editor.value
      ?.chain()
      .focus()
      .insertContent({
        type: 'video',
        attrs: { src: videoUrl.value, controls: true, width: '100%' },
      })
      .run()
  }
  closeVideoDialog()
}

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,
      Color,
      Highlight,
      UnderlineExtension,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      BlockquoteExtension,
      Table.configure({ resizable: true }).extend({
        addNodeView() {
          return VueNodeViewRenderer(TableView)
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      VideoExtensions,
      // 代码高亮扩展
      CodeBlockLowlight.configure({ lowlight }).extend({
        addNodeView() {
          return VueNodeViewRenderer(CodeBlockView)
        },
      }),
      // 可拖拽调整大小的图片
      ResizableImage.configure({
        inline: false,
        allowBase64: false,
      }),
      Dropcursor,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: '',
    autofocus: true,
    onCreate({ editor }) {
      // 监听来自 TableView 的自定义事件
      ;(editor as any).on &&
        (editor as any).on('table:add-row', (payload: any) => {
          // 这里可以在外层做额外处理，比如显示提示或做统计
          console.log('TableView 请求添加行，payload:', payload)
        })

      // 监听 drop 事件
      editor.view.dom.addEventListener('drop', async (event: DragEvent) => {
        event.preventDefault()
        if (!event.dataTransfer?.files?.length) return
        for (const file of event.dataTransfer.files) {
          if (file.type.startsWith('image/')) {
            const url = await uploadImages(file)
            if (url) {
              // 插入本地地址的图片用于显示
              editor.chain().focus().setImage({ src: url }).run()
            }
          }
        }
      })
      // 新增 paste 事件
      editor.view.dom.addEventListener(
        'paste',
        async (event: ClipboardEvent) => {
          if (!event.clipboardData?.files?.length) return
          for (const file of event.clipboardData.files) {
            if (file.type.startsWith('image/')) {
              // 上传图片
              const url = await uploadImages(file)
              // 插入本地预览
              if (url) {
                editor.chain().focus().setImage({ src: url }).run()
              }
            }
          }
        }
      )
    },
    onUpdate({ editor }) {
      const state = editor.state
      const { from } = state.selection
      const node = state.doc.nodeAt(from)
      console.log('当前指针位置的元素:', node?.type.name || '无')
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped></style>
