<template>
  <ul class="flex flex-col gap-4">
    <Card
      @click="handleCardClick(0)"
      class="w-60"
      :activation="activation == 0"
    >
      <div class="flex gap-2 text-background-content justify-between">
        <span
          class="flex gap-2 items-center justify-center text-background-content font-bold"
          :class="{ 'text-primary': activation == 0 }"
        >
          <Signpost />
          全部板块
        </span>
      </div>
    </Card>

    <li
      v-for="plate in postStore.plate[currentRouteName as string]"
      :key="plate.id"
    >
      <Card
        @click="handleCardClick(plate.id)"
        class="w-60"
        :activation="activation == plate.id"
      >
        <div class="flex gap-2 text-background-content justify-between">
          <span
            class="flex gap-2 items-center justify-center text-background-content font-bold"
            :class="{ 'text-primary': activation == plate.id }"
          >
            <Signpost />
            {{ plate.name }}
          </span>
        </div>
      </Card>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { plate } from '@/apis'
import { usePostStore } from '@/stores/postStore'
import { onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import type { Api } from '@/types'
import type { Plate } from '@/types/Plate'
import Card from '../Card.vue'
import { Signpost } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const currentRouteName = ref<string>((route.name as string) || '')
const toast = useToast()
const postStore = usePostStore()

const activation = ref<number>(0)

/** 获取板块列表 */
const getPlate = async () => {
  const typeId = currentRouteName.value === 'modList' ? 2 : 1
  plate
    .getPlateList()
    .then((res) => {
      const data = res.data as Api
      if (data.code !== 200) {
        return toast.error('获取板块失败')
      }
      const plates = data.data.rows as Plate[]

      postStore.plate[currentRouteName.value] = plates.filter(
        (plate) => plate.type === typeId
      )
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.message)
    })
}

const handleCardClick = (plateId: number) => {
  router.push({ name: route.name, params: { plateId } })
  activation.value = plateId
}

onMounted(async () => {
  getPlate()
})

watch(
  () => route.name,
  () => {
    currentRouteName.value = (route.name as string) || ''
    getPlate()
    console.log(route.name)
  }
)
</script>
