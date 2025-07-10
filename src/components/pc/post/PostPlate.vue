<template>
  <ul class="flex flex-col gap-4 p-1 min-w-40">
    <Card
      @click="handleCardClick(0, route, router)"
      class="w-full"
      :activation="activation == 0">
      <div class="flex gap-2 text-background-content justify-between">
        <span
          class="flex gap-2 items-center justify-center text-background-content font-bold"
          :class="{ 'text-primary': activation == 0 }">
          <Signpost />
          全部板块
        </span>
      </div>
    </Card>

    <li
      v-for="plate in postStore.plate[
        postStore.currentPlate.currentRouteName as string
      ]"
      :key="plate.id">
      <Card
        @click="handleCardClick(plate.id, route, router)"
        class="w-full"
        :activation="
          activation == plate.id ||
          postStore.currentPlate.currentRouteName == plate.name
        ">
        <div class="flex gap-2 text-background-content justify-between">
          <span
            class="flex gap-2 items-center justify-center text-background-content font-bold"
            :class="{ 'text-primary': activation == plate.id }">
            <Signpost />
            {{ plate.name }}
          </span>
        </div>
      </Card>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { usePostStore } from '@/stores/module/post/postStore'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Signpost } from 'lucide-vue-next'
import {
  getPlate,
  getPost,
  handleCardClick,
} from '@/stores/module/post/service'
import Card from '@/components/common/Card.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

const activation = ref(0)

onMounted(async () => {
  postStore.currentPlate.currentRouteName = (route.name as string) || ''
  activation.value = route.params.plateId
    ? +(route.params.plateId as string)
    : 0
  getPlate()
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
    getPlate()
    getPost(activation.value, route)
  }
)
</script>
