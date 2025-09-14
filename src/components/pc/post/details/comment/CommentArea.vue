<template>
  <Card class="comment-container mx-auto" :id="id">
    <!-- 评论输入框 -->
    <div
      v-if="userStore.isLogin"
      class="comment-input flex items-start gap-3 mb-6">
      <Avatar
        :src="userStore.userInfo.headImg"
        :alt="userStore.userInfo.nickname"
        :size="40"
        class="flex-shrink-0" />
      <div class="flex-1">
        <CommentInput
          @submit="replay"
          :submitText="$t('b.fa-biao-ping-lun')"
          :placeholder="$t('b.shuo-dian-shi-mo')" />
      </div>
    </div>

    <!-- 评论排序选项 -->
    <div
      class="flex justify-between items-center border-b border-gray mb-4 pb-2">
      <div class="comment-sort flex items-center">
        <span class="mr-3">{{ $t('d.pai-xu-fang-shi') }}</span>
        <ScButton
          v-for="sort in sortOptions"
          :key="sort.value"
          class="px-3 py-1 mr-2 rounded-md"
          :activation="currentSort === sort.value"
          :icon="sort.icon"
          Border
          @click="setSort(sort.value)">
          {{ sort.label }}
        </ScButton>
      </div>
      <div>
        <span>
          {{ $t('d.zong-ping-lun-commentspagetotal', [commentsPage.total]) }}
        </span>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-5">
      <!-- 单条评论 -->
      <div v-for="comment in comments" :key="comment.id">
        <div class="flex items-start gap-3">
          <!-- 用户头像 -->
          <Avatar
            :src="comment.author.headImg"
            :alt="comment.author.nickname"
            :size="40"
            class="flex-shrink-0"
            @click.stop="openImg(comment.author.headImg)" />

          <!-- 评论内容 -->
          <div class="flex-1 group/one">
            <div class="flex items-center mb-1">
              <span
                class="font-medium mr-2"
                @click.stop="
                  $router.push({
                    name: 'userPanel',
                    query: { userId: comment.author.id },
                  })
                ">
                {{ comment.author.nickname }}
              </span>

              <ScTag
                v-if="comment.author.id == postData?.author.id"
                size="sm"
                bgColor="#FFADBB"
                class="text-xs px-1 rounded">
                {{ $t('b.tie-zhu') }}
              </ScTag>
              <span
                class="text-gray-content text-xs ml-2"
                @click="currentPopupBox = `${comment.id}`">
                {{ comment.createdAt }}
              </span>

              <div
                class="flex flex-1 justify-end"
                @click="currentPopupBox = `${comment.id}`">
                <PopupBox
                  position="bottom"
                  noActivation
                  noPd
                  class="transition-opacity"
                  :class="{
                    'opacity-100': currentPopupBox === `${comment.id}`,
                    'opacity-0 group-hover/one:opacity-100':
                      currentPopupBox !== `${comment.id}`,
                  }"
                  :icon="EllipsisVertical">
                  <CommentMenu
                    @updateComment="getcomments(1)"
                    :comment-id="comment.id" />
                </PopupBox>
              </div>
            </div>

            <div
              class="mb-2"
              @click="currentPopupBox = `${comment.id}`"
              v-html="comment.content"></div>

            <!-- 图片 -->
            <div v-if="comment.image" class="flex flex-wrap gap-2 mb-2">
              <img
                v-for="(img, imgIndex) in comment.image"
                :key="imgIndex"
                :src="img"
                :alt="$t('d.ping-lun-tu-pian')"
                class="w-20 h-20 object-cover rounded-md cursor-pointer"
                @click="openImg(img)" />
            </div>

            <!-- 点赞回复操作 -->
            <CommentReplyButton
              :commentId="comment.id"
              :like-count="comment.likeCount"
              :is-like="comment.isLike"
              @reply="replay" />

            <!-- 回复列表 -->
            <div
              v-if="comment.children.length > 0"
              class="reply-list mt-3 pl-4 border-l border-gray space-y-3">
              <div
                v-for="reply in comment.children.slice(
                  0,
                  showAllReply === comment.id ? comment.children.length : 2
                )"
                :key="reply.id"
                class="reply-item">
                <div class="flex items-start gap-3 group/item">
                  <Avatar
                    :src="reply.author.headImg"
                    :alt="reply.author.nickname"
                    :size="32"
                    class="flex-shrink-0"
                    @click.stop="openImg(reply.author.headImg)" />

                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <span
                        class="font-medium mr-2"
                        @click="
                          $router.push({
                            name: 'userPanel',
                            query: { userId: reply.author.id },
                          })
                        ">
                        {{ reply.author.nickname }}
                      </span>
                      <ScTag
                        v-if="reply.author.id == postData?.author.id"
                        size="sm"
                        bgColor="#FFADBB"
                        class="text-xs px-1 rounded">
                        {{ $t('b.tie-zhu') }}
                      </ScTag>
                      <span
                        class="text-gray-content text-xs ml-2"
                        @click="currentPopupBox = `${comment.id}-${reply.id}`">
                        {{ reply.createdAt }}
                      </span>

                      <div
                        class="flex flex-1 justify-end"
                        @click="currentPopupBox = `${comment.id}-${reply.id}`">
                        <PopupBox
                          position="bottom"
                          noActivation
                          noPd
                          class="transition-opacity"
                          :class="{
                            'opacity-100':
                              currentPopupBox == `${comment.id}-${reply.id}`,
                            'opacity-0 group-hover/item:opacity-100':
                              currentPopupBox != `${comment.id}-${reply.id}`,
                          }"
                          :icon="EllipsisVertical">
                          <CommentMenu
                            @updateComment="getcomments(1)"
                            :comment-id="reply.id" />
                        </PopupBox>
                      </div>
                    </div>

                    <div class="mb-1">
                      <span
                        v-if="reply.toAuthor"
                        class="text-active mr-2"
                        @click.stop="
                          $router.push({
                            name: 'userPanel',
                            query: { userId: reply.toAuthor.id },
                          })
                        ">
                        @{{ reply.toAuthor.nickname }}
                      </span>
                      <span
                        @click="currentPopupBox = `${comment.id}-${reply.id}`"
                        v-html="reply.content">
                      </span>
                    </div>

                    <!-- 图片 -->
                    <div v-if="reply.image" class="flex flex-wrap gap-2 mb-2">
                      <img
                        v-for="(img, replyImgIndex) in reply.image"
                        :key="replyImgIndex"
                        :src="img"
                        :alt="$t('d.ping-lun-tu-pian')"
                        class="w-20 h-20 object-cover rounded-md cursor-pointer"
                        @click="openImg(img)" />
                    </div>

                    <!-- 点赞回复操作 -->
                    <CommentReplyButton
                      :commentId="comment.id"
                      :to-comment-id="reply.id"
                      :like-count="reply.likeCount"
                      :is-like="reply.isLike"
                      @reply="replay" />
                  </div>
                </div>
              </div>

              <!-- 查看更多回复 -->
              <ScButton
                v-if="comment.children.length > 2"
                :icon="showAllReply === comment.id ? ArrowUp : ArrowDown"
                activation
                noBg
                class="text-sm flex items-center"
                @click="
                  showAllReply = showAllReply === comment.id ? 0 : comment.id
                ">
                {{
                  showAllReply === comment.id
                    ? '收起回复'
                    : `查看${comment.children.length} 条回复`
                }}
              </ScButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="text-center mt-6">
      <ScButton
        class="px-4 py-2 rounded-md mx-auto"
        Border
        :disabled="
          commentsPage.page >=
          Math.ceil(commentsPage.total / commentsPage.limit)
        "
        @click="getcomments(commentsPage.page + 1)">
        {{ currentLoadButtonText }}
      </ScButton>
    </div>

    <ScModal v-model="imageModal">
      <div class="relative w-[90vw] h-[90vh] overflow-hidden">
        <ZoomableImage :src="imgurl" @click-outside="imageModal = false" />
        <button
          class="absolute z-[10] top-[5rem] right-[5rem] rounded-full w-10 h-10 border border-error hover:border-active/80 text-error hover:text-active/80"
          @click="imageModal = false">
          <X class="mx-auto" />
        </button>
      </div>
    </ScModal>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import type { Post } from '@/types/Post'
import ScButton from '@/components/common/ScButton.vue'
import PopupBox from '@/components/common/PopupBox.vue'
import { ArrowDown, EllipsisVertical, ArrowUp, X } from 'lucide-vue-next'
import ScTag from '@/components/common/ScTag.vue'
import { useUserStore } from '@/stores/module/user/userStore'
import { commentApi } from '@/apis'
import type { CommentType, SendCommentDto } from '@/types/comment'
import { formatLink, formatTime } from '@/utils/format'
import { useToast } from 'vue-toastification'
import CommentReplyButton from './CommentReplyButton.vue'
import CommentMenu from './CommentMenu.vue'
import CommentInput from './CommentInput.vue'
import ScModal from '@/components/common/ScModal.vue'
import ZoomableImage from '@/components/common/ScZoomableImage.vue'
import { useI18n } from 'vue-i18n'
import { getSortOptions } from '@/stores/module/post/service'
import { sendComment } from '@/stores/module/comment/service'
import { formatImageSrcsInHtml } from '@/utils/regex'
const { t } = useI18n()

const toast = useToast()
const props = defineProps<{
  postData: Post | null
  id?: string
}>()

// 当前用户
const userStore = useUserStore()
// const replayContent = ref('') // 评论内容
// 图片查看弹窗相关
const imageModal = ref(false) // 图片查看弹窗
const imgurl = ref('')

// 排序选项
const sortOptions = computed(() => {
  return getSortOptions(t)
})
const currentSort = ref(1)

const currentPopupBox = ref('')
const showAllReply = ref(0)
const currentLoadButtonText = computed(() => {
  return commentsPage.value.page >=
    Math.ceil(commentsPage.value.total / commentsPage.value.limit)
    ? t('b.dao-di-le')
    : t('b.jia-zai-geng-duo-ping-lun')
})

const comments = ref<CommentType[]>([])
const commentsPage = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const openImg = (img: string) => {
  imageModal.value = true
  imgurl.value = img
}

const setSort = (value: number) => {
  currentSort.value = value
  commentsPage.value.page = 1 // 重置页码
  getcomments(commentsPage.value.page)
}

const getcomments = (page: number) => {
  if (props.postData == null) return
  if (
    commentsPage.value.page >=
      Math.ceil(commentsPage.value.total / commentsPage.value.limit) &&
    page > commentsPage.value.page
  ) {
    return
  }
  commentApi
    .getPostComments({
      postId: props.postData.id,
      page: page,
      limit: commentsPage.value.limit,
      orderType: currentSort.value,
    })
    .then((res) => {
      if (res.data.code === 200) {
        const list = res.data.data.list.map((item: any) => {
          item.createdAt = formatTime(item.createdAt)
          item.image = item.image
            ? item.image.map((img: string) => formatLink(img))
            : []
          item.content = formatImageSrcsInHtml(item.content)
          item.children = item.children.map((child: any) => {
            child.createdAt = formatTime(child.createdAt)
            child.image = child.image
              ? child.image.map((img: string) => formatLink(img))
              : []
            return child
          })
          return item
        })
        if (page == 1) {
          comments.value = list
        } else {
          comments.value.push(...list)
        }
        commentsPage.value.total = res.data.data.total
        commentsPage.value.page = res.data.data.page
      }
    })
    .catch((error) => {
      toast.error(
        t('t.huo-qu-ping-lun-shi-bai-qing-shao-hou-zai-shi') + error.msg
      )
      console.error('获取评论时发生错误:', error)
    })
}

const replay = (
  content: string,
  image?: string[],
  commentId?: number,
  toCommentId?: number
) => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu-hou-zai-fa-biao-ping-lun'))
    return
  }
  if (!props.postData) {
    return
  }
  if (content.trim() === '') {
    toast.error(t('t.ping-lun-nei-rong-bu-neng-wei-kong'))
    return
  }
  const data: SendCommentDto = {
    postId: props.postData.id,
    content: content,
  }
  if (commentId) {
    data.commentId = commentId
  }
  if (toCommentId) {
    data.toCommentId = toCommentId
  }
  if (image && image.length > 0) {
    data.image = image
  }
  console.log(data)

  sendComment(t, data, () => {
    console.log('评论发送成功')
    getcomments(1)
  })
}

watch(
  () => props.postData,
  (newVal) => {
    if (newVal) {
      getcomments(1) // 获取评论列表
    }
  },
  { immediate: true }
)
</script>
