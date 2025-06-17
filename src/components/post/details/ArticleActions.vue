<template>
  <div class="w-28 relative">
    <div class="sticky top-16 py-2 w-ful">
      <Card v-if="postData" class="mb-4" noPg>
        <ScButton isCol :icon="MessageCircleMore" :icon-size="24">
          {{ postData.commentCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="ThumbsUp"
          :icon-size="24"
          :class="{ ' text-error': postData.isLiked }"
          @click="likePost(postData.id)">
          {{ postData.likeCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="ThumbsDown"
          :icon-size="24"
          :class="{ ' text-error': postData.isBaded }"
          @click="badPost(postData.id)">
          {{ postData.badCount }}
        </ScButton>
      </Card>

      <Card noPg v-if="postData && verifyPermissions([1, 2, 5])" class="mb-4">
        <ScButton
          :class="{
            ' text-green': postData.disabled == 1,
            ' text-error': postData.disabled == 0,
          }"
          isCol
          :icon="Trash2"
          :icon-size="24"
          @click="deletePost(postData.id)">
          {{ postData.disabled == 0 ? '删除' : '恢复' }}
        </ScButton>
        <div
          v-if="postData.creatorId == userStore.userInfo.id"
          class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          v-if="postData.creatorId == userStore.userInfo.id"
          :class="{
            'text-error': postData.visible == 1,
            'text-success': postData.visible == 2,
          }"
          isCol
          :icon="postData.visible == 1 ? ArrowDownFromLine : ArrowUpToLine"
          :icon-size="24"
          @click="unpublishItem(postData.id)">
          {{ postData.visible == 1 ? '下架' : '发布' }}
        </ScButton>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { verifyPermissions } from '@/hook/verify'
import Card from '@/components/Card.vue'
import ScButton from '@/components/ScButton.vue'
import {
  MessageCircleMore,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  ArrowDownFromLine,
  ArrowUpToLine,
} from 'lucide-vue-next'
import { postApi } from '@/apis'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

const props = defineProps({
  postData: {
    type: Object as PropType<Post>,
    required: true,
  },
})
const emit = defineEmits(['updatePost'])

const likePost = (postId: number) => {
  postApi
    .postLike(postId)
    .then(() => {
      emit('updatePost', props.postData.id)
    })
    .catch((error) => {
      console.error('Error liking post:', error)
    })
}

const badPost = (postId: number) => {
  postApi
    .postBad(postId)
    .then(() => {
      emit('updatePost', props.postData.id)
    })
    .catch((error) => {
      console.error('Error liking post:', error)
    })
}

const deletePost = (postId: number) => {
  if (!verifyPermissions([1, 2, 5])) {
    return
  }
  postApi
    .deletePostAsAdmin({
      id: postId,
      disabled: props.postData.disabled == 1 ? 0 : 1,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        emit('updatePost', props.postData.id)
        toast.success('操作成功')
      } else {
        toast.error('操作失败: ' + response.data.msg)
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
}

const unpublishItem = (postId: number) => {
  if (props.postData.id !== postId) {
    toast.error('帖子不存在或已被删除')
    return
  }
  postApi
    .updatePost({
      id: postId,
      visible: props.postData.visible == 1 ? 0 : 1,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        emit('updatePost', props.postData.id)
        toast.success('操作成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
}
</script>
