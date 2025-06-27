<template>
  <div class="comment-input">
    <textarea
      v-model="commentContent"
      placeholder="写下你的评论..."
      class="w-full p-3 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-active focus:border-transparent"></textarea>
    <ScButton @click="submitComment" activation class="hover:bg-active/60">
      提交评论
    </ScButton>
  </div>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()
const props = defineProps({
  commentId: {
    type: Number,
    required: true,
  },
  toCommentId: {
    type: Number,
    required: false,
  },
})

const commentContent = ref('')
const emit = defineEmits(['submit'])

const submitComment = () => {
  if (commentContent.value.trim() === '') {
    toast.error('评论内容不能为空')
    return
  }
  console.log(
    'submit',
    commentContent.value,
    props.commentId,
    props.toCommentId
  )

  emit('submit', commentContent.value, props.commentId, props.toCommentId)
  commentContent.value = ''
}
</script>
