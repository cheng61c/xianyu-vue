<template>
  <Card v-if="postData" class="justify-evenly" noPg noCol>
    <ScButton isCol :icon="MessageCircleMore" :icon-size="24">
      {{ postData.commentCount }}
    </ScButton>

    <ScButton
      isCol
      :icon="ThumbsUp"
      :icon-size="24"
      :class="{ 'text-like': postData.isLiked }"
      @click="likePost(postData.id)">
      {{ postData.likeCount }}
    </ScButton>

    <ScButton
      isCol
      :icon="ThumbsDown"
      :icon-size="24"
      :class="{ 'text-bad': postData.isBaded }"
      @click="badPost(postData.id)">
      {{ postData.badCount }}
    </ScButton>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { MessageCircleMore, ThumbsUp, ThumbsDown } from 'lucide-vue-next'
import { postApi } from '@/apis'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const toast = useToast()

const props = defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
const emit = defineEmits(['updatePost'])

const likePost = (postId: number) => {
  postApi
    .postLike(postId)
    .then(() => {
      emit('updatePost', props.postData?.id)
      toast.success(t('t.cao-zuo-cheng-gong'))
    })
    .catch((error) => {
      console.error('Error liking post:', error)
    })
}

const badPost = (postId: number) => {
  postApi
    .postBad(postId)
    .then(() => {
      emit('updatePost', props.postData?.id)
      toast.success(t('t.cao-zuo-cheng-gong'))
    })
    .catch((error) => {
      console.error('Error liking post:', error)
    })
}
</script>
