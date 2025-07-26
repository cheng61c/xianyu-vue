<template>
  <div class="relative flex-shrink-0">
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
          :class="{ 'text-like': postData.isLiked }"
          @click="likePost(postData.id)">
          {{ postData.likeCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="ThumbsDown"
          :icon-size="24"
          :class="{ ' text-bad': postData.isBaded }"
          @click="badPost(postData.id)">
          {{ postData.badCount }}
        </ScButton>

        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          :icon="TriangleAlert"
          :icon-size="24"
          @click="reportModal = true">
          {{ $t('b.ju-bao') }}
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
          {{ postData.disabled == 0 ? $t('b.shan-chu') : $t('b.hui-fu') }}
        </ScButton>
        <div class="w-4/5 border-1 border-gray mx-auto"></div>
        <ScButton
          isCol
          noBg
          class="group"
          :class="{
            'text-primary': postData.top == 0,
            'text-warning': postData.top != 0,
          }"
          :icon="postData.top == 0 ? ArrowUpToLine : ArrowDownFromLine"
          :icon-size="24"
          @click="setTopItem(postData.id)">
          <div
            class="w-[4ch] break-all group-hover:text-active"
            :class="{
              'text-primary': postData.top == 0,
              'text-warning': postData.top != 0,
            }">
            {{
              postData.top == 0 ? $t('b.zhi-ding') : $t('b.qu-xiao-zhi-ding')
            }}
          </div>
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
          {{ postData.visible == 1 ? $t('b.xia-jia') : $t('b.fa-bu') }}
        </ScButton>
      </Card>
    </div>
  </div>

  <ScModal v-model="reportModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">{{ $t('d.ju-bao-tie-zi') }}</h3>
      <div>
        {{ $t('t.tie-zi-biao-ti') }}
        <span class="text-active"> {{ postData?.title }} </span>
      </div>
      <div>
        {{
          $t(
            'd.ni-que-ding-yao-ju-bao-ci-ping-lun-ma-qing-ti-gong-ju-bao-li-you-wo-men-hui-jin-kuai-chu-li'
          )
        }}
      </div>
      <ScInput
        class="mt-4"
        multiline
        :placeholder="$t('d.qing-shu-ru-ju-bao-li-you')"
        :rows="4"
        :maxlength="200"
        v-model="reportReason"></ScInput>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="handleReportSubmit" Border>
          {{ $t('b.ti-jiao') }}
        </ScButton>
        <ScButton class="px-4" @click="reportModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps, ref } from 'vue'
import type { PropType } from 'vue'
import { verifyPermissions } from '@/utils/verify'
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
import { useUserStore } from '@/stores/module/user/userStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
        toast.success(t('t.cao-zuo-cheng-gong'))
      } else {
        toast.error(t('t.cao-zuo-shi-bai') + response.data.msg)
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

const unpublishItem = (postId: number) => {
  if (props.postData?.id !== postId) {
    toast.error(t('t.tie-zi-bu-cun-zai-huo-yi-bei-shan-chu'))
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
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

const setTopItem = (postId: number) => {
  if (props.postData?.id !== postId) {
    toast.error(t('t.tie-zi-bu-cun-zai-huo-yi-bei-shan-chu'))
    return
  }
  postApi
    .updatePostAsAdmin({
      id: postId,
      top: props.postData.top == 0 ? 1 : 0,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        emit('updatePost', props.postData?.id)
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

const handleReportSubmit = () => {
  if (!reportModal.value || !props.postData) return
  if (userStore.isLogin === false) {
    toast.error(t('t.qing-xian-deng-lu'))
    return
  }
  if (!reportReason.value.trim()) {
    toast.error(t('t.ju-bao-li-you-bu-neng-wei-kong'))
    return
  }
  reportApi
    .createReport({
      targetType: 1,
      targetId: props.postData.id,
      reason: reportReason.value,
    })
    .then(() => {
      toast.success(t('t.ju-bao-yi-ti-jiao-wo-men-hui-jin-kuai-chu-li'))
      reportModal.value = false
      reportReason.value = ''
    })
    .catch((error) => {
      toast.error(t('t.ju-bao-shi-bai') + error.msg)
    })
}
</script>
