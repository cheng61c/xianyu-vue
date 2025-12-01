<template>
  <ScButtonSelector v-model="activation" :options="plates"> </ScButtonSelector>
</template>
<script setup lang="ts">
import { usePostStore } from '@/stores/module/post/postStore'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getPlate,
  getPost,
  handleCardClick,
} from '@/stores/module/post/service'
import { useI18n } from 'vue-i18n'
import ScButtonSelector from '@/components/common/ScButtonSelector.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const plates = computed(() => {
  const list =
    postStore.plate[postStore.currentPlate.currentRouteName as string] || []
  return [
    {
      value: 0,
      label: t('b.quan-bu-ban-kuai'),
    },
    ...list.map((item) => {
      return {
        value: item.id,
        label: item.name,
      }
    }),
  ]
})

const activation = ref<number>(0)

onMounted(async () => {
  postStore.currentPlate.currentRouteName = (route.name as string) || ''
  activation.value = route.params.plateId
    ? +(route.params.plateId as string)
    : 0
  getPlate(t)
})

watch(activation, (newVal) => {
  handleCardClick(newVal, route, router)
})

watch(
  () => route.path,
  () => {
    if (postStore.currentPlate.currentRouteName !== (route.name as string)) {
      activation.value = 0
    } else {
      activation.value = route.params.plateId
        ? +(route.params.plateId as string)
        : 0
    }

    postStore.currentPlate.currentRouteName = (route.name as string) || ''
    getPlate(t)
    getPost(activation.value, route, t)
  }
)
</script>
