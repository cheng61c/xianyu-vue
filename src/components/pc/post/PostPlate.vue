<template>
  <ul class="flex flex-col gap-4 p-1 min-w-40">
    <Card
      @click="handleCardClick(0)"
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
      v-for="plate in postStore.plate[currentRouteName as string]"
      :key="plate.id">
      <Card
        @click="handleCardClick(plate.id)"
        class="w-full"
        :activation="activation == plate.id || currentRouteName == plate.name">
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
import { plateApi } from '@/apis'
import { usePostStore } from '@/stores/postStore'
import { onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import type { Api } from '@/types'
import type { Plate } from '@/types/Plate'
import Card from '@/components/common/Card.vue'
import { Signpost } from 'lucide-vue-next'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const currentRouteName = ref<string>((route.name as string) || '')
const toast = useToast()
const postStore = usePostStore()
const configStore = useConfigStore()

const activation = ref(0)

/** 获取板块列表 */
const getPlate = async () => {
  const typeId =
    configStore.menuItems.find(
      (item) => item.pathName === currentRouteName.value
    )?.type || 1
  plateApi
    .getPlateList()
    .then((res: Api) => {
      const data = res.data
      if (data.code !== 200) {
        return toast.error('获取板块失败')
      }
      const plates = data.data as Plate[]

      postStore.plate[currentRouteName.value] = plates.filter(
        (plate) => plate.type === typeId
      )
    })
    .catch((error) => {
      toast.error('获取板块失败: ' + error.message)
      console.error('获取板块失败:', error)
    })
}

const handleCardClick = (plateId: number) => {
  router.push({ name: route.name, params: { plateId } })
  activation.value = plateId
  configStore.currentPlateId = plateId
}

onMounted(async () => {
  currentRouteName.value = (route.name as string) || ''
  activation.value = route.params.plateId
    ? +(route.params.plateId as string)
    : 0
  getPlate()
})

watch(
  () => route.path,
  () => {
    if (currentRouteName.value !== (route.name as string)) {
      activation.value = 0
    }
    currentRouteName.value = (route.name as string) || ''
    getPlate()
  }
)
</script>
