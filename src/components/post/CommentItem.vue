<template>
  <div class="mb-4 pl-4 border-l">
    <p>
      <strong>{{ comment.author }}</strong
      >: {{ comment.content }}
    </p>
    <button
      @click="replying = !replying"
      class="text-sm text-blue-600 hover:underline"
    >
      回复
    </button>

    <div v-if="replying" class="mt-2">
      <textarea
        v-model="replyText"
        class="w-full p-1 border rounded"
        rows="2"
        placeholder="回复内容..."
      ></textarea>
      <button
        @click="submitReply"
        class="mt-1 px-3 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        发送
      </button>
    </div>

    <!-- 子评论递归渲染 -->
    <CommentItem
      v-for="child in comment.children || []"
      :key="child.id"
      :comment="child"
      @reply="(id, content) => $emit('reply', id, content)"
    />
  </div>
</template>

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
