<template>
  <ul>
    <li v-for="plate in postStore.plate" :key="plate.id">{{ plate.name }}></li>
  </ul>
  <button @click="msg">dianji</button>
</template>

<script setup lang="ts">
// Your TypeScript logic goes here
import { getPlateList } from '@/apis/plate'
import { usePostStore } from '@/stores/postStore'
import { onMounted } from 'vue'

import { notify } from '@kyvg/vue3-notification'
import { useToast } from 'vue-toastification'
const toast = useToast()
const msg = () => {
  notify('You clicked the button!')
  toast.success('Button clicked!')
}

const postStore = usePostStore()

onMounted(async () => {
  const res = await getPlateList()
  postStore.plate = [
    /* fetch or initialize your plates here */
  ]
})
</script>
