<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getMotd" :icon="RotateCcw" Border> 刷新 </ScButton>
      <ScButton @click="updateMotd" :icon="Save" Border> 保存 </ScButton>
      <ScButton @click="addMotd" :icon="Plus" Border> 新增 </ScButton>
    </div>
    <div class="flex gap-2 items-center">
      <span class="text-gray-content">当前公告</span>
      <Dropdown
        v-model="motdBar"
        :options="motdBarOptions"
        placeholder="无"
        class="w-xs" />
    </div>
  </Card>

  <Card>
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <span>缩进宽度:</span>
        <ScInput
          v-model="tabWidth"
          type="number"
          placeholder="缩进宽度"
          class="h-10 mb-[2px]" />
        <ScButton @click="format()" Border noPd class="h-[42px] px-3">
          确定
        </ScButton>
      </div>
      <div class="flex gap-4">
        <div class="flex">
          <kbd class="kbd">Tab</kbd>
          <span class="text-gray-content ml-1">缩进</span>
        </div>
        <div class="flex">
          <kbd class="kbd">Ctrl</kbd>
          +
          <kbd class="kbd">S</kbd>
          <span class="text-gray-content ml-1">格式化并保存</span>
        </div>
      </div>
    </div>

    <div class="relative flex border border-gray rounded-md overflow-y-hidden">
      <!-- 行号栏 -->
      <div
        ref="lineNumber"
        class="line-numbers select-none text-right px-2 py-2 text-xs text-gray-content dark:bg-gray/60 bg-gray/20 border-r border-gray overflow-y-hidden"
        aria-hidden="true">
        <span
          v-for="(_, i) in lines"
          :key="i"
          class="block leading-[1.5rem] font-mono text-[16px]">
          {{ i + 1 }}
        </span>
      </div>

      <!-- 输入框 -->
      <div class="relative flex-1">
        <textarea
          v-model="motdContent"
          ref="textarea"
          class="code-input w-full px-4 py-2 text-[16px] leading-[1.5rem] resize-none overflow-auto focus:outline-none overflow-y-hidden"
          placeholder="什么也没有"
          :maxlength="8000"
          @input="handleInput"
          @scroll="syncScroll"
          rows="1" />
        <div
          class="absolute right-4 bottom-2 text-xs text-gray-content select-none">
          {{ motdContent.length }} / 8000
        </div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from '@/components/Card.vue'
import ScInput from '@/components/ScInput.vue'
import ScButton from '@/components/ScButton.vue'
import { Plus, RotateCcw, Save } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { motdApi } from '@/apis'
import { useToast } from 'vue-toastification'
import type { MotdType } from '@/types/Motd'
import Dropdown from '@/components/ScSelector.vue'
import { formatTime } from '@/hook/format'
import prettier from 'prettier/standalone'
import parserXml from '@prettier/plugin-xml'
import { useEditorShortcuts } from '@/utils/useEditorShortcuts'
const toast = useToast()

const motd = ref<MotdType[]>([])
const motdContent = ref('')
const tabWidth = ref(4) // 缩进宽度
const textarea = ref<HTMLTextAreaElement | null>(null)
const lineNumber = ref<HTMLDivElement | null>(null)
// 行数
const lines = computed(() => motdContent.value.split('\n'))

const motdBar = ref<number | { value: number; label: string }>(0)
const motdBarOptions = ref<{ value: number; label: string }[]>([])

const getMotd = () => {
  motdApi
    .getMotdAsAdmin()
    .then((response) => {
      if (response.data && response.data.code === 200) {
        motd.value = response.data.data.map((item: MotdType) => {
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          item.motd = decodeURIComponent(item.motd)
          return item
        })
        motdBarOptions.value = motd.value.map(
          (item: MotdType, index: number) => ({
            label: item.createdAt,
            value: index,
          })
        )
        format()
      } else {
        motd.value = []
        toast.info('No MOTD found.')
      }
    })
    .catch((error) => {
      toast.error('Failed to fetch MOTD.')
      console.error('Error fetching MOTD:', error)
    })
}

const updateMotd = () => {
  const index =
    typeof motdBar.value === 'object' ? motdBar.value.value : motdBar.value

  const body = {
    motd: motdContent.value,
    id: motd.value[index]?.id,
  }
  motdApi
    .updateMotd(body)
    .then(() => {
      toast.success('更新成功')
      getMotd()
    })
    .catch((error) => {
      console.error('Error updating MOTD:', error)
      toast.error('更新失败: ' + error.msg)
    })
}

const addMotd = () => {
  motdApi
    .createMotd({ motd: motdContent.value })
    .then(() => {
      toast.success('添加成功')
      getMotd()
    })
    .catch((error) => {
      console.error('Error adding MOTD:', error)
      toast.success('添加失败: ' + error.msg)
    })
}

const format = async (isUpdate = false) => {
  const motdBarValue =
    typeof motdBar.value === 'object' ? motdBar.value.value : motdBar.value
  // motdContent.value = formatXml(motd.value[motdBarValue]?.motd) || ''

  motdContent.value = motd.value[motdBarValue]?.motd || ''
  motdBar.value = motdBarOptions.value[motdBarValue] || 0

  // 获取输入框元素
  const inputEl = document.querySelector('textarea')
  if (!inputEl) {
    // fallback
    motdContent.value = await prettier.format(formatXml(motdContent.value), {
      parser: 'xml',
      plugins: [parserXml],
      tabWidth: +tabWidth.value,
      useTabs: false,
      printWidth: 150,
      xmlWhitespaceSensitivity: 'ignore',
      xmlSelfClosingSpace: true,
      xmlExpandSelfClosing: false,
    })
    if (isUpdate) {
      updateMotd()
    }
    handleInput()
    return
  }

  // 记录当前光标位置
  const selectionStart = inputEl.selectionStart
  const selectionEnd = inputEl.selectionEnd

  // 格式化内容
  const formatted = await prettier.format(formatXml(motdContent.value), {
    parser: 'xml',
    plugins: [parserXml],
    tabWidth: +tabWidth.value,
    useTabs: false,
    printWidth: 150,
    xmlWhitespaceSensitivity: 'ignore',
    xmlSelfClosingSpace: true,
    xmlExpandSelfClosing: false,
  })

  // 计算格式化前后内容的差异，尽量恢复光标原位
  // 简单做法：如果内容没变，直接恢复；否则尽量恢复到原字符位置
  motdContent.value = formatted

  await nextTick()
  if (inputEl.value.length >= selectionEnd) {
    inputEl.setSelectionRange(selectionStart, selectionEnd)
  } else {
    // 如果内容变短，光标放到末尾
    inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length)
  }
  if (isUpdate) {
    updateMotd()
  }
  handleInput()
}

function formatXml(xml: string) {
  const formatted = xml
    .replace(/</g, '\n<')
    .replace(/>/g, '>\n')
    .replace(/\n\n/g, '\n')
  return formatted.trim()
}

// 自动高度
const handleInput = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
  nextTick(syncLineNumberHeight)
}

// 行号栏高度同步
const syncLineNumberHeight = () => {
  if (textarea.value && lineNumber.value) {
    lineNumber.value.style.height = `${textarea.value.scrollHeight + 6}px`
  }
}

// 滚动联动
const syncScroll = () => {
  if (textarea.value && lineNumber.value) {
    lineNumber.value.scrollTop = textarea.value.scrollTop
  }
}

useEditorShortcuts(textarea, tabWidth, () => {
  format(true)
})
onMounted(() => {
  getMotd()
})

watch(motdBar, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    format(false)
  }
})

watch(textarea, () => {
  handleInput()
})
</script>

<style scoped>
.line-numbers {
  min-width: 2.5rem;
  text-align: right;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/public/JetBrainsMono-SemiBold.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

.code-input {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  white-space: pre;
}
</style>
