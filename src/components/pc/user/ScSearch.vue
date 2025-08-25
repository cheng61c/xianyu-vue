<template>
  <Card>
    <div
      class="flex flex-wrap items-center gap-4"
      :class="{
        'justify-center': deviceStore.device == 1,
        'justify-between': deviceStore.device == 2,
      }">
      <div class="flex max-w-xs gap-2 flex-shrink-0 items-center">
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
        v-if="searchType == 2 && deviceStore.device == 2"
        class="flex gap-2 flex-1 items-center justify-end text-active-content ml-40">
        <div class="flex-shrink-0">{{ $t('b.shai-xuan-lei-xing') }}</div>
        <ScButtonSelector :options="fileTypeOptions" v-model="fileType" />
      </div>

      <div
        v-if="deviceStore.device == 2"
        class="flex gap-2 flex-1 items-center justify-end text-active-content ml-40">
        <div class="flex-shrink-0">排序方式:</div>
        <ScButtonSelector
          :options="orderTypeOptions"
          v-model="postStore.orderType" />
      </div>

      <PopupBox
        v-if="searchType == 2 && deviceStore.device == 1"
        ref="popupBox"
        position="bottom-left"
        :icon="Funnel"
        className="mt-1 py-1.5 px-1"
        noPd>
        <template #default="{ close }">
          <Card noPg class="p-2 w-22 items-center">
            <ScButtonSelector
              col
              :options="fileTypeOptions"
              v-model="fileType"
              @click="close()" />
          </Card>
        </template>
      </PopupBox>

      <PopupBox
        v-if="deviceStore.device == 1"
        ref="popupBox"
        position="bottom-left"
        :icon="ArrowDownWideNarrow"
        className="mt-1 py-1.5 px-1"
        noPd>
        <template #default="{ close }">
          <Card noPg class="p-2 w-22 items-center">
            <ScButtonSelector
              col
              :options="orderTypeOptions"
              v-model="postStore.orderType"
              @click="close()" />
          </Card>
        </template>
      </PopupBox>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { computed, defineProps, ref, watch } from 'vue'
import ScButton from '@/components/common/ScButton.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButtonSelector from '@/components/common/ScButtonSelector.vue'
import PopupBox from '@/components/common/PopupBox.vue'
import { useI18n } from 'vue-i18n'
import { Funnel, ArrowDownWideNarrow } from 'lucide-vue-next'
import { getFileTypeOptions } from '@/stores/module/post/service'
import { useDeviceStore } from '@/stores/global/deviceStore'
import { usePostStore } from '@/stores/module/post/postStore'

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
const deviceStore = useDeviceStore()
const postStore = usePostStore()
const fileType = ref<number>(0)
const fileTypeOptions = getFileTypeOptions(t)
const orderTypeOptions = computed(() => postStore.orderTypeOptions)

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
watch(
  () => postStore.orderType,
  () => {
    handleSearch()
  }
)
const handleSearch = () => {
  emit('search', String(searchText.value), true, String(fileType.value))
}
</script>
