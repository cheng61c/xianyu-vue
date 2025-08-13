<template>
  <Card>
    <div class="flex justify-between flex-wrap items-center gap-4">
      <div class="flex w-xs gap-2">
        <ScInput
          v-model="searchText"
          :placeholder="t('b.sou-suo')"
          type="search"
          @keyup.enter="handleSearch" />
        <ScButton @click="handleSearch" Border>
          {{ $t('b.sou-suo') }}
        </ScButton>
      </div>

      <div
        v-if="searchType == 2"
        class="flex gap-2 flex-1 items-center justify-end text-active-content ml-40">
        <div class="flex-shrink-0">{{ $t('b.shai-xuan-lei-xing') }}</div>
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
import { useI18n } from 'vue-i18n'
import { getFileTypeOptions } from '@/stores/module/post/service'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  searchType: {
    type: Number,
    default: 1,
  },
})

const { t } = useI18n()

const fileType = ref<number>(0)
const fileTypeOptions = getFileTypeOptions(t)

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
