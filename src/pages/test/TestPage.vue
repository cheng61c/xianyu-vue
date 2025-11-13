<template>
  <TipTap :shadow="postContent !== null" v-model="postContent"></TipTap>
</template>

<script setup lang="ts">
import TipTap from '@/components/common/TipTap.vue'
import { ref } from 'vue'

const postContent = ref<string>('<p></p>')
</script>
