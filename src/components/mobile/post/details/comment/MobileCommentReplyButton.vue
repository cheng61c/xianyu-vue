<template>
  <!-- 点赞回复 -->
  <div class="comment-actions flex items-center text-text-gray text-sm">
    <ScButton
      :icon="ThumbsUp"
      class="flex items-center mr-3"
      :class="{ 'text-error': localIsLike == 1 }"
      @click="likeItem(commentId, toCommentId)"
      noPd>
      <span>{{ localLikeCount }}</span>
    </ScButton>
    <ScButton noPd @click="openReply(commentId, toCommentId)"> 回复 </ScButton>
  </div>
  <div v-if="currentInput === `${commentId}-${toCommentId ?? 0}`" class="mt-3">
    <CommentInput
      :comment-id="commentId"
      :to-comment-id="toCommentId"
      @submit="reply"
      :submitText="$t('b.fa-biao-ping-lun')"
      :placeholder="$t('b.shuo-dian-shi-mo')"></CommentInput>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/module/user/userStore'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { ThumbsUp } from 'lucide-vue-next'
import ScButton from '@/components/common/ScButton.vue'
import CommentInput from '@/components/pc/post/details/comment/CommentInput.vue'
import { commentApi } from '@/apis'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()
const props = defineProps({
  likeCount: {
    type: Number,
    required: true,
  },
  isLike: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
  },
  toCommentId: {
    type: Number,
    required: false,
  },
})

const localLikeCount = ref(props.likeCount ?? 0)
const localIsLike = ref(props.isLike ?? 0)
const currentInput = ref('')
const emit = defineEmits(['reply'])

const openReply = (commentId: number, toCommentId?: number) => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu-hou-zai-fa-biao-ping-lun'))
    return
  }
  // 打开回复输入框
  if (currentInput.value === `${commentId}-${toCommentId || '0'}`) {
    currentInput.value = ''
    return
  }
  currentInput.value = `${commentId}-${toCommentId || '0'}`
}
const reply = (
  content: string,
  image?: string[],
  commentId?: number,
  toCommentId?: number
) => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu-hou-zai-fa-biao-ping-lun'))
    return
  }
  emit('reply', content, image, commentId, toCommentId)
  currentInput.value = ''
}

const likeItem = (commentId: number, toCommentId?: number) => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu-hou-zai-dian-zan'))
    return
  }
  const body = {
    id: toCommentId ? toCommentId : commentId,
  }
  commentApi
    .LikeComment(body)
    .then((res) => {
      if (res.data.code === 200) {
        localLikeCount.value = res.data.data.likeCount
        localIsLike.value = res.data.data.liked ? 1 : 0
        toast.success(t('t.dian-zan-cheng-gong'))
      }
    })
    .catch((error) => {
      console.error('Error liking comment:', error)
      toast.error(t('t.dian-zan-shi-bai-qing-shao-hou-zai-shi') + error.msg)
    })
}
</script>
