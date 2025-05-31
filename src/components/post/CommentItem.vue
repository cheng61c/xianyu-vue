<template></template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  comment: {
    id: number
    author: string
    content: string
    created_at: string
    children?: any[]
  }
}>()

const { comment } = props

const emit = defineEmits<{
  (e: 'reply', id: number, content: string): void
}>()

const replying = ref(false)
const replyText = ref('')

function submitReply() {
  if (!replyText.value.trim()) return
  emit('reply', comment.id, replyText.value)
  replyText.value = ''
  replying.value = false
}
</script>
