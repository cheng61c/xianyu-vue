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

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="TriangleAlert"
          :icon-size="24"
          @click="reportModal = true">
          举报
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

  <ScModal v-model="reportModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">举报帖子</h3>
      <div>
        帖子标题: <span class="text-active"> {{ postData?.title }} </span>
      </div>
      <div>你确定要举报此评论吗？请提供举报理由，我们会尽快处理。</div>
      <ScInput
        class="mt-4"
        multiline
        placeholder="请输入举报理由"
        :rows="4"
        :maxlength="200"
        v-model="reportReason"></ScInput>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="handleReportSubmit" Border>
          提交
        </ScButton>
        <ScButton class="px-4" @click="reportModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps, ref } from 'vue'
import type { PropType } from 'vue'
import { verifyPermissions } from '@/hook/verify'
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import ScModal from '@/components/common/ScModal.vue'
import ScInput from '@/components/common/ScInput.vue'
import {
  MessageCircleMore,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  ArrowDownFromLine,
  ArrowUpToLine,
  TriangleAlert,
} from 'lucide-vue-next'
import { postApi, reportApi } from '@/apis'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

const props = defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})
const emit = defineEmits(['updatePost'])
const reportModal = ref(false)
const reportReason = ref('')

const likePost = (postId: number) => {
  postApi
    .postLike(postId)
    .then(() => {
      emit('updatePost', props.postData?.id)
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
      disabled: props.postData?.disabled == 1 ? 0 : 1,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        emit('updatePost', props.postData?.id)
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
  if (props.postData?.id !== postId) {
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
        emit('updatePost', props.postData?.id)
        toast.success('操作成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
}

const handleReportSubmit = () => {
  if (!reportModal.value || !props.postData) return
  if (userStore.isLogin === false) {
    toast.error('请先登录')
    return
  }
  if (!reportReason.value.trim()) {
    toast.error('举报理由不能为空')
    return
  }
  reportApi
    .createReport({
      targetType: 1,
      targetId: props.postData.id,
      reason: reportReason.value,
    })
    .then(() => {
      toast.success('举报已提交，我们会尽快处理')
      reportModal.value = false
      reportReason.value = ''
    })
    .catch((error) => {
      toast.error('举报失败: ' + error.msg)
    })
}
</script>
