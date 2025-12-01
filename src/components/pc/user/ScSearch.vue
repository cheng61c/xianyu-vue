<template>
  <Card>
    <div class="flex flex-col justify-between items-center gap-4">
      <div class="flex flex-wrap justify-between w-full gap-2">
        <div class="flex flex-1 gap-2 flex-shrink-0 items-center min-w-60">
          <ScInput
            v-model="searchText"
            :placeholder="t('b.sou-suo')"
            type="search"
            @keyup.enter="handleSearch" />
          <ScButton @click="handleSearch" Border>
            {{ $t('b.sou-suo') }}
          </ScButton>
        </div>

        <div class="flex items-center gap-2" v-if="deviceStore.device == 2">
          <div class="flex-shrink-0">{{ $t('d.pai-xu-fang-shi') }}</div>
          <ScButtonSelector
            :options="orderTypeOptions"
            v-model="postStore.orderType" />
        </div>

        <div
          v-if="deviceStore.device == 1"
          class="flex gap-2 items-center flex-1 justify-end">
          <PopupBox
            v-if="searchType == 2"
            ref="popupBox"
            position="bottom-left"
            :icon="Funnel"
            :iconSize="20"
            className="mt-1 py-1.5 px-1"
            noPd>
            <template #default="{ close }">
              <Card noPg class="p-2 w-22 items-center">
                <ScButtonSelector
                  col
                  :options="fileTypeOptions"
                  v-model="postStore.fileType"
                  @click="close()" />
              </Card>
            </template>
          </PopupBox>

          <PopupBox
            ref="popupBox"
            position="bottom-left"
            :icon="ArrowDownWideNarrow"
            :iconSize="20"
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
      </div>

      <div
        v-if="deviceStore.device == 2"
        class="flex flex-wrap gap-2 w-full items-center text-active-content"
        :class="[isHome ? ' justify-between' : 'justify-end']">
        <PostPlate v-if="isHome" />
        <div
          v-if="searchType == 2 && deviceStore.device == 2"
          class="flex gap-2 w-54 items-center justify-end text-active-content">
          <div class="flex-shrink-0">{{ $t('b.shai-xuan-lei-xing') }}</div>
          <!-- <ScButtonSelector
          :options="fileTypeOptions"
          v-model="postStore.fileType" /> -->
          <ScSelector
            :options="fileTypeOptions"
            v-model="fileType"
            class="w-full"
            :placeholder="$t('b.quan-bu')" />
        </div>
      </div>
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
import {
  getFileTypeOptions,
  getSortOptions,
} from '@/stores/module/post/service'
import { useDeviceStore } from '@/stores/global/deviceStore'
import { usePostStore } from '@/stores/module/post/postStore'
import ScSelector from '@/components/common/ScSelector.vue'
import PostPlate from '../post/PostPlate.vue'

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
const fileTypeOptions = getFileTypeOptions(t)
const orderTypeOptions = getSortOptions(t)
const fileType = ref<number | { value: number; label: string }>(
  postStore.fileType
)
const isHome = computed(() => {
  return (
    postStore.currentPlate.currentRouteName == 'postList' ||
    postStore.currentPlate.currentRouteName == 'modList'
  )
})

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

watch(
  () => fileType.value,
  () => {
    postStore.fileType =
      typeof fileType.value === 'number' ? fileType.value : fileType.value.value
    handleSearch()
  }
)
watch(
  () => postStore.orderType,
  () => {
    handleSearch()
  }
)
const handleSearch = () => {
  console.log(
    '当前文件类型' + postStore.fileType,
    props.searchType,
    props.searchType == 2 ? String(postStore.fileType) : '0'
  )

  emit(
    'search',
    String(searchText.value),
    true,
    props.searchType == 2 ? String(postStore.fileType) : '0'
  )
}
</script>
