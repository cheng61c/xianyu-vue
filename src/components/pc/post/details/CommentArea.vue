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
          rows="3"></textarea>
        <div class="flex justify-between items-center mt-2">
          <div class="flex space-x-2">
            <ScButton class="text-gray hover:text-active">
              <i class="icon-smile text-lg"></i>
            </ScButton>
            <ScButton class="text-gray hover:text-active">
              <i class="icon-at text-lg"></i>
            </ScButton>
            <ScButton class="text-gray hover:text-active">
              <i class="icon-picture text-lg"></i>
            </ScButton>
          </div>
          <ScButton class="px-4 py-1 rounded-md" Border> 评论 </ScButton>
        </div>
      </div>
    </div>

    <!-- 评论排序选项 -->
    <div class="comment-sort flex items-center mb-4 pb-2 border-b border-gray">
      <span class="text-gray-600 mr-3">排序方式：</span>
      <ScButton
        v-for="sort in sortOptions"
        :key="sort.value"
        class="px-3 py-1 mr-2 rounded-md"
        :activation="currentSort === sort.value">
        {{ sort.label }}
      </ScButton>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list space-y-5">
      <!-- 单条评论 -->
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="flex items-start gap-3">
          <!-- 用户头像 -->
          <Avatar
            :src="comment.author.headImg"
            :size="40"
            class="flex-shrink-0" />

          <!-- 评论内容 -->
          <div class="flex-1">
            <div class="comment-header flex items-center mb-1">
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
              <span class="text-gray-content text-sm ml-2">
                {{ comment.createdAt }}
              </span>
            </div>

            <div class="comment-content mb-2">
              {{ comment.content }}
            </div>

            <!-- 点赞回复操作 -->
            <div class="comment-actions flex items-center text-gray text-sm">
              <ScButton
                :icon="ThumbsUp"
                class="flex items-center mr-3 hover:text-active"
                noPd>
                <span>{{ comment.likeCount }}</span>
              </ScButton>
              <ScButton
                :icon="ThumbsDown"
                class="flex items-center mr-4 hover:text-active"
                noPd>
              </ScButton>
              <ScButton class="hover:text-active" noPd>回复</ScButton>
            </div>

            <!-- 回复列表 -->
            <div
              v-if="comment.children.length > 0"
              class="reply-list mt-3 pl-4 border-l border-gray space-y-3">
              <div
                v-for="reply in comment.children"
                :key="reply.id"
                class="reply-item">
                <div class="flex items-start gap-3">
                  <Avatar
                    :src="reply.author.headImg"
                    :size="32"
                    class="flex-shrink-0" />
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <span class="font-medium text-sm mr-2">
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
                      <span class="text-gray-content text-xs ml-2">
                        {{ reply.createdAt }}
                      </span>
                    </div>
                    <div class="text-sm mb-1">
                      <span v-if="reply.toAuthor" class="text-active">
                        @{{ reply.toAuthor.nickname }}
                      </span>
                      {{ reply.content }}
                    </div>
                    <div class="flex items-center text-gray text-xs">
                      <ScButton
                        :icon="ThumbsUp"
                        class="flex items-center mr-3 hover:text-active"
                        noPd>
                        <span>{{ reply.likeCount }}</span>
                      </ScButton>
                      <ScButton
                        :icon="ThumbsDown"
                        class="flex items-center mr-3 hover:text-active"
                        noPd>
                      </ScButton>
                      <ScButton class="hover:text-active" noPd>回复</ScButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 查看更多回复 -->
              <ScButton
                v-if="comment.children.length > 2"
                :icon="ArrowDown"
                activation
                noBg
                class="text-sm flex items-center">
                共{{ comment.children.length }}条回复
              </ScButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="text-center mt-6">
      <ScButton class="px-4 py-2 rounded-md mx-auto" Border>
        加载更多评论
      </ScButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import type { Post } from '@/types/Post'
import ScButton from '@/components/common/ScButton.vue'
import { ThumbsUp, ThumbsDown, ArrowDown } from 'lucide-vue-next'
import ScTag from '@/components/common/ScTag.vue'
import { useUserStore } from '@/stores/userStore'

defineProps<{
  postData: Post | null
}>()

// 当前用户
const userStore = useUserStore()

// 排序选项
const sortOptions = ref([
  { value: 'hot', label: '最热' },
  { value: 'new', label: '最新' },
  { value: 'old', label: '最早' },
  { value: 'like', label: '点赞数' },
])
const currentSort = ref('hot')

// 模拟评论数据
const comments = ref([
  {
    likeCount: 0,
    isLike: 0,
    id: 1,
    toCommentId: 0,
    content: '第一条评论!',
    createdAt: '2025-06-22T14:40:41.488Z',
    image: [],
    author: {
      id: 1,
      nickname: '用户_19704e7a139',
      headImg:
        '/upload/preview?filename=59aea410f43696343e1cafdb4122f878d5bb937a5528dd4e0c67d3cc74d20d82-avatar-xianyu-1750529697777.png',
      roles: [
        {
          id: 1,
          name: '超管',
          color:
            'linear-gradient(90deg, rgb(255, 215, 0) 0%, rgb(0, 188, 255) 49%, rgb(0, 255, 121) 100%)',
        },
        {
          id: 11,
          name: '酸菜虾米',
          color:
            'linear-gradient(90deg, rgb(94, 102, 243) 0%, rgb(136, 217, 165) 46%, rgb(255, 0, 178) 100%)',
        },
      ],
    },
    toAuthor: null,
    children: [
      {
        likeCount: 0,
        isLike: 0,
        id: 2,
        toCommentId: 0,
        content: '第二条评论,二级回复!',
        createdAt: '2025-06-22T14:47:41.962Z',
        image: [],
        author: {
          id: 1,
          nickname: '用户_19704e7a139',
          headImg:
            '/upload/preview?filename=59aea410f43696343e1cafdb4122f878d5bb937a5528dd4e0c67d3cc74d20d82-avatar-xianyu-1750529697777.png',
          roles: [
            {
              id: 1,
              name: '超管',
              color:
                'linear-gradient(90deg, rgb(255, 215, 0) 0%, rgb(0, 188, 255) 49%, rgb(0, 255, 121) 100%)',
            },
            {
              id: 11,
              name: '酸菜虾米',
              color:
                'linear-gradient(90deg, rgb(94, 102, 243) 0%, rgb(136, 217, 165) 46%, rgb(255, 0, 178) 100%)',
            },
          ],
        },
        toAuthor: {
          id: 1,
          nickname: '用户_19704e7a139',
          headImg:
            '/upload/preview?filename=59aea410f43696343e1cafdb4122f878d5bb937a5528dd4e0c67d3cc74d20d82-avatar-xianyu-1750529697777.png',
        },
      },
      {
        likeCount: 0,
        isLike: 0,
        id: 3,
        toCommentId: 2,
        content: '第三条回复,三级评论',
        createdAt: '2025-06-22T14:53:07.631Z',
        image: [],
        author: {
          id: 11,
          nickname: '机器人9',
          headImg: '',
          roles: [],
        },
        toAuthor: {
          id: 1,
          nickname: '用户_19704e7a139',
          headImg:
            '/upload/preview?filename=59aea410f43696343e1cafdb4122f878d5bb937a5528dd4e0c67d3cc74d20d82-avatar-xianyu-1750529697777.png',
        },
      },
      {
        likeCount: 0,
        isLike: 0,
        id: 4,
        toCommentId: 2,
        content: '第三条回复,三级评论',
        createdAt: '2025-06-22T14:53:07.631Z',
        image: [],
        author: {
          id: 11,
          nickname: '机器人9',
          headImg: '',
          roles: [],
        },
        toAuthor: {
          id: 1,
          nickname: '用户_19704e7a139',
          headImg:
            '/upload/preview?filename=59aea410f43696343e1cafdb4122f878d5bb937a5528dd4e0c67d3cc74d20d82-avatar-xianyu-1750529697777.png',
        },
      },
    ],
  },
])
</script>

<style scoped>
.icon-smile,
.icon-at,
.icon-picture,
.icon-like,
.icon-dislike,
.icon-down {
  /* 这里使用伪元素或字体图标库的类 */
  display: inline-block;
  width: 1em;
  height: 1em;
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: middle;
}

/* 示例图标样式 - 实际项目中请使用真实图标库 */
.icon-like::before {
  content: '👍';
}
.icon-dislike::before {
  content: '👎';
}
.icon-down::before {
  content: '↓';
}
.icon-smile::before {
  content: '😊';
}
.icon-at::before {
  content: '@';
}
.icon-picture::before {
  content: '🖼';
}
</style>
