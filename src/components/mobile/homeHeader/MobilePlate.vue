<template>
  <div
    class="flex min-w-full min-h-10 overflow-x-auto overflow-y-hidden no-scrollbar">
    <ScButton
      @click="handleCardClick(0, route, router)"
      :activation="activation == 0">
      {{ $t('b.quan-bu-ban-kuai') }}
    </ScButton>

    <ScButton
      v-for="plate in postStore.plate[
        postStore.currentPlate.currentRouteName as string
      ]"
      :key="plate.id"
      @click="handleCardClick(plate.id, route, router)"
      :activation="
        activation == plate.id ||
        postStore.currentPlate.currentRouteName == plate.name
      ">
      {{ plate.name }}
    </ScButton>
  </div>
</template>
<script setup lang="ts">
import { usePostStore } from '@/stores/module/post/postStore'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { Signpost } from 'lucide-vue-next'
import {
  getPlate,
  getPost,
  handleCardClick,
} from '@/stores/module/post/service'
import ScButton from '@/components/common/ScButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

const activation = ref(0)
// const showMask = ref(false)

onMounted(async () => {
  postStore.currentPlate.currentRouteName = (route.name as string) || ''
  activation.value = route.params.plateId
    ? +(route.params.plateId as string)
    : 0
  getPlate(t)
  getPost(activation.value, route, t)
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
  },
  { immediate: true }
)
</script>

<style scoped>
.mask {
  background-image: linear-gradient(
    90deg,
    var(--color-background) 0%,
    rgba(0, 0, 0, 0) 10%,
    rgba(0, 0, 0, 0) 90%,
    var(--color-background) 100%
  );
}
</style>
