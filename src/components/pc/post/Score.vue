<template>
  <div>
    <!-- Your template content goes here -->
  </div>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import { defineProps, onMounted } from 'vue'

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

const getScoreData = async (postId: number) => {
  postApi
    .getScoreList(postId)
    .then((res) => {
      if (res.data.code === 200) {
        // Handle successful response
        console.log('Score data:', res.data)
      }
    })
    .catch((error) => {
      console.error('Network error:', error)
    })
}

onMounted(() => {
  // Fetch the score data when the component is mounted
  getScoreData(props.postId)
})
</script>
