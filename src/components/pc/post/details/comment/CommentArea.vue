<template>
  <Card class="comment-container mx-auto">
    <!-- 评论输入框 -->
    <div class="comment-input flex items-start gap-3 mb-6">
      <Avatar
        :src="userStore.userInfo.headImg"
        :size="40"
        class="flex-shrink-0" />
      <div class="flex-1">
        <textarea
          class="w-full p-3 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-active focus:border-transparent"
          placeholder="发个友善的评论吧~"
          rows="3"
          v-model="replayContent"></textarea>
        <div class="flex justify-between items-center mt-2">
          <div class="flex space-x-2">
            <ScButton :icon="ImagePlus" :icon-size="18" Border disabled>
            </ScButton>
          </div>
          <ScButton
            class="px-4 py-1 rounded-md"
            Border
            @click="replay(replayContent)">
            评论
          </ScButton>
        </div>
      </div>
    </div>

    <!-- 评论排序选项 -->
    <div
      class="flex justify-between items-center border-b border-gray mb-4 pb-2">
      <div class="comment-sort flex items-center">
        <span class="text-gray-600 mr-3">排序方式：</span>
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
        <span>总评论: {{ commentsPage.total }}</span>
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
            :size="40"
            class="flex-shrink-0" />

          <!-- 评论内容 -->
          <div class="flex-1 group">
            <div class="flex items-center mb-1">
              <span class="font-medium mr-2">
                {{ comment.author.nickname }}
              </span>

              <ScTag
                v-if="comment.author.id == postData?.author.id"
                size="sm"
                bgColor="var(--color-pink)"
                color="var(--color-pink-content)"
                class="text-xs px-1 bg-pink-100 text-pink-600 rounded">
                帖主
              </ScTag>
              <span
                class="text-gray-content text-sm ml-2"
                @click="currentPopupBox = `${comment.id}`">
                {{ comment.createdAt }}
              </span>

              <div class="flex flex-1 justify-end">
                <PopupBox
                  buttonText=""
                  position="bottom"
                  noActivation
                  noPd
                  class="transition-opacity"
                  :class="{
                    'opacity-100': currentPopupBox === `${comment.id}`,
                    'opacity-0 group-hover/item:opacity-100':
                      currentPopupBox !== `${comment.id}`,
                  }"
                  :icon="EllipsisVertical">
                  <CommentMenu @updateComment="getcomments(1)" />
                </PopupBox>
              </div>
            </div>

            <div class="mb-2" @click="currentPopupBox = `${comment.id}`">
              {{ comment.content }}
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
                    :size="32"
                    class="flex-shrink-0" />

                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <span
                        class="font-medium mr-2"
                        @click="currentPopupBox = `${comment.id}-${reply.id}`">
                        {{ reply.author.nickname }}
                      </span>
                      <ScTag
                        v-if="reply.author.id == postData?.author.id"
                        size="sm"
                        bgColor="var(--color-pink)"
                        color="var(--color-pink-content)"
                        class="text-xs px-1 bg-pink-100 text-pink-600 rounded">
                        帖主
                      </ScTag>
                      <span
                        class="text-gray-content text-xs ml-2"
                        @click="currentPopupBox = `${comment.id}-${reply.id}`">
                        {{ reply.createdAt }}
                      </span>

                      <div class="flex flex-1 justify-end">
                        <PopupBox
                          buttonText=""
                          position="bottom"
                          noActivation
                          noPd
                          class="transition-opacity"
                          :class="{
                            'opacity-100':
                              currentPopupBox === `${comment.id}-${reply.id}`,
                            'opacity-0 group-hover/item:opacity-100':
                              currentPopupBox !== `${comment.id}-${reply.id}`,
                          }"
                          :icon="EllipsisVertical">
                          <CommentMenu @updateComment="getcomments(1)" />
                        </PopupBox>
                      </div>
                    </div>

                    <div class="mb-1">
                      <span v-if="reply.toAuthor" class="text-active mr-2">
                        @{{ reply.toAuthor.nickname }}
                      </span>
                      <span
                        @click="currentPopupBox = `${comment.id}-${reply.id}`">
                        {{ reply.content }}
                      </span>
                    </div>

                    <!-- 点赞回复操作 -->
                    <CommentReplyButton
                      :commentId="comment.id"
                      :to-comment-id="reply.id"
                      :like-count="reply.likeCount"
                      :is-like="comment.isLike"
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
        @click="getcomments(commentsPage.page + 1)">
        {{ currentLoadButtonText }}
      </ScButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import type { Post } from '@/types/Post'
import ScButton from '@/components/common/ScButton.vue'
import PopupBox from '@/components/common/PopupBox.vue'
import {
  ArrowDown,
  ImagePlus,
  EllipsisVertical,
  ArrowUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-vue-next'
import ScTag from '@/components/common/ScTag.vue'
import { useUserStore } from '@/stores/userStore'
import { commentApi } from '@/apis'
import type { CommentType, SendCommentDto } from '@/types/comment'
import { formatTime } from '@/hook/format'
import { useToast } from 'vue-toastification'
import CommentReplyButton from './CommentReplyButton.vue'
import CommentMenu from './CommentMenu.vue'

const toast = useToast()
const props = defineProps<{
  postData: Post | null
}>()

// 当前用户
const userStore = useUserStore()
const replayContent = ref('') // 评论内容

// 排序选项
const sortOptions = ref([
  { value: '1', label: '时间降序', icon: ArrowDownWideNarrow },
  { value: '2', label: '时间升序', icon: ArrowUpNarrowWide },
  { value: '3', label: '点赞降序', icon: ArrowDownWideNarrow },
  { value: '4', label: '点赞升序', icon: ArrowUpNarrowWide },
])
const currentSort = ref('1')

const currentPopupBox = ref('')
const showAllReply = ref(0)
const currentLoadButtonText = computed(() => {
  return commentsPage.value.page >=
    Math.ceil(commentsPage.value.total / commentsPage.value.limit)
    ? '到底了'
    : '加载更多评论'
})

const commentsPage = ref({
  page: 1,
  limit: 2,
  total: 0,
})

const setSort = (value: string) => {
  currentSort.value = value
  commentsPage.value.page = 1 // 重置页码
  getcomments(commentsPage.value.page)
}

// 模拟评论数据
const comments = ref<CommentType[]>([])

const getcomments = (page: number) => {
  if (props.postData == null) return
  if (
    commentsPage.value.total > 0 &&
    commentsPage.value.page >=
      Math.ceil(commentsPage.value.total / commentsPage.value.limit)
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
          item.children = item.children.map((child: any) => {
            child.createdAt = formatTime(child.createdAt)
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
      toast.error('获取评论失败，请稍后再试: ' + error.msg)
      console.error('获取评论时发生错误:', error)
    })
}

const replay = (content: string, commentId?: number, toCommentId?: number) => {
  if (!userStore.isLogin) {
    toast.error('请先登录后再发表评论')
    return
  }
  if (!props.postData) {
    return
  }
  if (content.trim() === '') {
    toast.error('评论内容不能为空')
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
  console.log(data)

  commentApi
    .sendComment(data)
    .then((res) => {
      if (res.data.code === 200) {
        replayContent.value = ''
        getcomments(1) // 重新获取评论列表
      }
    })
    .catch((error) => {
      toast.error('发表评论失败，请稍后再试: ' + error.msg)
      console.error('发表评论时发生错误:', error.msg)
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

<style scoped></style>
