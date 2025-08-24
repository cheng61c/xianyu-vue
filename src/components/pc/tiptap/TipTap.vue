<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
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
  Link2,
  VideoIcon,
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
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
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
import { useI18n } from 'vue-i18n'
import { Video } from '@/extensions/video'
import { getBili } from '@/apis/bili'
const { t } = useI18n()

const deviceStore = useDeviceStore()
const expanded = ref(true) // 控制是否展开

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
const btnClass = computed(() => {
  return deviceStore.device === 2
    ? 'tooltip tooltip-bottom p-2'
    : 'p-1.5 tooltip tooltip-bottom'
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
  Undo: t('tip.che-xiao-keyboardshortcutz', [keyboardShortcut]),
  Redo: t('tip.t-tip-t-tip-zhong-zuo-keyboardshortcuty-keyboardshortcut'),
  CodeBlock: t('tip.dai-ma-kuai-keyboardshortcutaltc', [keyboardShortcut]),
  Code: t('tip.hang-nei-dai-ma-keyboardshortcute', [keyboardShortcut]),
  Blockquote: t('tip.yin-yong-kuai-keyboardshortcutshiftb', [keyboardShortcut]),
  Heading: t('tip.biao-ti-keyboardshortcutalt-shu-zi', [keyboardShortcut]),
  Bold: t('tip.jia-cu-keyboardshortcutb', [keyboardShortcut]),
  Italic: t('tip.xie-ti-keyboardshortcuti', [keyboardShortcut]),
  Strikethrough: t('tip.shan-chu-xian-keyboardshortcutshifts', [
    keyboardShortcut,
  ]),
  Underline: t('tip.xia-hua-xian-keyboardshortcutu', [keyboardShortcut]),
  Copy: t('tip.fu-zhi-keyboardshortcutc', [keyboardShortcut]),
  Paste: t('tip.nian-tie-keyboardshortcutv', [keyboardShortcut]),
  Highlight: t('tip.gao-liang-keyboardshortcutshifth', [keyboardShortcut]),
  Subscript: t('tip.xia-biao-keyboardshortcut', [keyboardShortcut]),
  Superscript: t('tip.shang-biao-keyboardshortcut', [keyboardShortcut]),
  LeftAlign: t('tip.zuo-dui-qi-keyboardshortcutshiftl', [keyboardShortcut]),
  CenterAlign: t('tip.ju-zhong-dui-qi-keyboardshortcutshifte', [
    keyboardShortcut,
  ]),
  RightAlign: t('tip.you-dui-qi-keyboardshortcutshiftr', [keyboardShortcut]),
  JustifyAlign: t('tip.dui-qi-quan-ye-keyboardshortcutshiftj', [
    keyboardShortcut,
  ]),
  OrderedList: t('tip.you-xu-lie-biao-keyboardshortcuto', [keyboardShortcut]),
  BulletList: t('tip.wu-xu-lie-biao-keyboardshortcutl', [keyboardShortcut]),
  Image: t('tip.cha-ru-tu-pian-keyboardshortcutshifti', [keyboardShortcut]),
  Link: '插入链接',
  Video: '插入视频',
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
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https',
      }),
      Video,
      Document,
      Paragraph,
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

const insertLink = () => {
  if (editor.value) {
    const previousUrl = editor.value.getAttributes('link').href
    if (editor.value.state.selection.empty && !previousUrl) {
      alert('请先选中一些文本再插入链接')
      return
    }
    const url = prompt('将文本设置为链接：', previousUrl)
    if (url) {
      editor.value.chain().focus().setLink({ href: url }).run()
    } else {
      editor.value.chain().focus().unsetLink().run()
    }
  }
}

const addVideo = async () => {
  const url = prompt('请输入B站视频链接:')
  if (!url) {
    return
  }

  // 链接转码，去除参数等
  const cleanUrl = encodeURI(url.trim().split('?')[0])
  getBili(cleanUrl).then((res) => {
    const bil = res.data.data
    console.log(res)

    if (bil && bil.formats && bil.formats.length > 0) {
      const videoUrl = bil.formats[0].videoUrl
      if (editor.value) {
        editor.value.chain().focus().setVideo({ src: videoUrl }).run()
      }
    } else {
      alert('无法获取视频信息，请检查URL是否正确')
    }
  })
}
</script>

<template>
  <ScButton
    v-if="deviceStore.device === 1"
    class="absolute top-[-1.8rem] right-1 z-3 bg-background px-2 shadow-md"
    noPd
    @click="expanded = !expanded">
    {{ expanded ? '收起工具栏' : '展开工具栏' }}
  </ScButton>

  <div class="h-full w-full overflow-hidden rounded-t-lg p-1">
    <div
      class="w-full max-h-[95dvh] bg-background"
      :class="{
        'p-4 rounded-xl border border-gray/40': deviceStore.device === 2,
        'overflow-y-auto': deviceStore.device === 1,
      }">
      <div
        :class="{
          'flex justify-center items-center gap-1 z-1 bg-background pl-6 pb-2':
            deviceStore.device === 2,
          'flex justify-center items-center w-screen z-2 rounded-xl mb-1 bg-background  overflow-hidden ':
            deviceStore.device === 1,
          'flex-wrap ': expanded,
          'flex-nowrap pl-88 overflow-x-auto w-screen': !expanded,
        }">
        <!-- 撤销 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().undo()"
          hoverable
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
          :data-tip="dataTip.OrderedList"
          noPd>
          <ListOrdered />
        </ScButton>
        <ScDivider vertical />

        <!-- 链接 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="insertLink"
          hoverable
          :activation="editor?.isActive('link')"
          :class="btnClass"
          :data-tip="dataTip.Link"
          noPd>
          <Link2 />
        </ScButton>

        <!-- 图片 -->
        <div :class="btnClass" :data-tip="dataTip.Image">
          <TipTapUploadImage @addImg="addImg" />
        </div>

        <!-- 视频 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="addVideo"
          hoverable
          :activation="editor?.isActive('video')"
          :class="btnClass"
          :data-tip="dataTip.Video"
          noPd>
          <VideoIcon />
        </ScButton>

        <!-- 代码块 -->
        <ScButton
          :shadow="false"
          size="small"
          @click="
            editor?.chain().focus().toggleCodeBlock({ language: 'ts' }).run()
          "
          :activation="editor?.isActive('codeBlock')"
          hoverable
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
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
          :class="btnClass"
          :data-tip="dataTip.RightAlign"
          noPd>
          <AlignRight />
        </ScButton>
      </div>

      <editor-content
        :editor="editor"
        :class="{
          mobileTipTap: deviceStore.device === 1,
        }" />
    </div>
  </div>
</template>
