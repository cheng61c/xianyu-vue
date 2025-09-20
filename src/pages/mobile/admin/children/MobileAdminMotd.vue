<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getMotd" :icon="RotateCcw" Border>
        {{ $t('b.shua-xin') }}
      </ScButton>
      <ScButton @click="updateMotd" :icon="Save" Border>
        {{ $t('b.bao-cun-xiu-gai') }}
      </ScButton>
      <ScButton @click="addMotd" :icon="Plus" Border>
        {{ $t('b.bao-cun-wei-xin-gong-gao') }}
      </ScButton>
    </div>
    <div class="flex gap-2 items-center">
      <span class="text-gray-content">{{ $t('d.dang-qian-gong-gao') }}</span>
      <Dropdown
        v-model="motdBar"
        :options="motdBarOptions"
        :placeholder="$t('other.null')"
        class="flex-1" />
    </div>
  </Card>

  <Card>
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <span>{{ $t('d.suo-jin-kuan-du') }}:</span>
        <ScInput
          v-model="tabWidth"
          type="number"
          :placeholder="$t('d.suo-jin-kuan-du')"
          class="flex-1" />
        <ScButton @click="format()" Border>
          {{ $t('b.que-ding') }}
        </ScButton>
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
          :placeholder="$t('d.shi-mo-ye-mei-you')"
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
import Card from '@/components/common/Card.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import { Plus, RotateCcw, Save } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { motdApi } from '@/apis'
import { useToast } from 'vue-toastification'
import type { MotdType } from '@/types/Motd'
import Dropdown from '@/components/common/ScSelector.vue'
import { formatTime, formatXml } from '@/utils/format'
import { useEditorShortcuts } from '@/utils/useEditorShortcuts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

const motd = ref<MotdType[]>([])
const motdContent = ref('')
const tabWidth = ref(2) // 缩进宽度
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
      }
    })
    .catch((error) => {
      toast.error(t('t.huo-qu-gong-gao-shi-bai') + error.msg)
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
      toast.success(t('t.geng-xin-cheng-gong'))
      getMotd()
    })
    .catch((error) => {
      console.error('Error updating MOTD:', error)
      toast.error(t('t.geng-xin-shi-bai') + error.msg)
    })
}

const addMotd = () => {
  motdApi
    .createMotd({ motd: motdContent.value })
    .then(() => {
      toast.success(t('t.tian-jia-cheng-gong'))
      getMotd()
    })
    .catch((error) => {
      console.error('Error adding MOTD:', error)
      toast.success(t('t.tian-jia-shi-bai') + error.msg)
    })
}

// 移除 prettier 后的 format 函数
const format = async (isUpdate = false) => {
  const motdBarValue =
    typeof motdBar.value === 'object' ? motdBar.value.value : motdBar.value

  // 获取原始内容
  motdContent.value = motd.value[motdBarValue]?.motd || ''
  motdBar.value = motdBarOptions.value[motdBarValue] || 0

  // 获取输入框元素（用于光标位置恢复）
  const inputEl = document.querySelector('textarea')

  // 记录原始光标位置
  const selectionStart = inputEl?.selectionStart || 0
  const selectionEnd = inputEl?.selectionEnd || 0

  // 使用纯本地格式化（同步操作，无需 async）
  const originalContent = motdContent.value
  motdContent.value = formatXml(originalContent, tabWidth.value)

  // 恢复光标位置（智能处理内容长度变化）
  await nextTick()
  if (inputEl) {
    if (motdContent.value.length >= selectionEnd) {
      // 内容变长或不变：尝试恢复原位置
      inputEl.setSelectionRange(selectionStart, selectionEnd)
    } else {
      // 内容变短：光标放到末尾
      inputEl.setSelectionRange(
        motdContent.value.length,
        motdContent.value.length
      )
    }
  }

  // 后续处理
  if (isUpdate) {
    updateMotd()
  }
  handleInput()
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
