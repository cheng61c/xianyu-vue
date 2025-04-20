<template>
  <ul class="flex flex-col gap-6">
    <li
      v-for="plate in postStore.plate[currentRouteName as string]"
      :key="plate.id"
    >
      <Card>
        <div class="flex gap-2">
          <div>{{ plate.name }}</div>
          <div>{{ plate.postCount }}</div>
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
import { useRoute } from 'vue-router'
import type { Api } from '@/types'
import type { Plate } from '@/types/Plate'
import Card from '../Card.vue'

const route = useRoute()
const currentRouteName = ref<string>((route.name as string) || '')
const toast = useToast()
const postStore = usePostStore()

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
