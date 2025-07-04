<template>
  <Card>
    <div class="flex justify-between flex-wrap items-center gap-4">
      <div class="flex w-xs gap-2">
        <ScInput
          v-model="searchText"
          :placeholder="placeholder"
          type="search"
          @keyup.enter="handleSearch" />
        <ScButton @click="handleSearch" Border> 搜索 </ScButton>
      </div>

      <div
        v-if="searchType == 2"
        class="flex gap-2 flex-1 items-center justify-end text-active-content ml-40">
        <div class="flex-shrink-0">筛选类型:</div>
        <ScButtonSelector :options="fileTypeOptions" v-model="fileType" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { defineProps, ref, watch } from 'vue'
import ScButton from '@/components/common/ScButton.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButtonSelector from '@/components/common/ScButtonSelector.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '搜索...',
  },
  searchType: {
    type: Number,
    default: 1,
  },
})

const fileType = ref<number>(0)
const fileTypeOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '存档' },
  { value: 2, label: '家具' },
  { value: 3, label: '材质' },
  { value: 4, label: '皮肤' },
  { value: 5, label: '模组' },
  { value: 7, label: '其他' },
]

const emit = defineEmits<{
  (e: 'search', value: string, click: boolean, type: string): void
  (e: 'update:modelValue', value: string | number): void
}>()

const searchText = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    searchText.value = val
  }
)

watch(searchText, (val) => {
  emit('update:modelValue', val)
})

watch(fileType, () => {
  handleSearch()
})

const handleSearch = () => {
  emit('search', String(searchText.value), true, String(fileType.value))
}
</script>
