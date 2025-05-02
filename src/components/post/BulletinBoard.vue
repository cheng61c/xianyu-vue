<template>
  <div
    class="flex flex-col gap-4 h-full overflow-y-auto px-1 w-4/5 no-scrollbar"
  >
    <Creation />
    <Card>
      <h2 class="card-title px-1.5">公告栏</h2>
      <div v-for="post in posts">
        <div
          v-if="post.top == 1"
          @click="handleClick(post)"
          class="flex gap-2 items-center px-1.5 py-1 hover:bg-gray/50 rounded-md cursor-pointer transition-all duration-200"
        >
          <div class="px-2 py-0.5 rounded-md bg-warning text-sm">置顶</div>
          <div class="font-bold">{{ post.title }}</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { usePostStore } from '@/stores/postStore'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import type { Post } from '@/types/Post'
import Creation from './Creation.vue'

const router = useRouter()
const configStore = useConfigStore()

const handleClick = (post: { id: any }) => {
  router.push({
    name: 'postDetails',
    params: { postId: post.id },
  })
}

const postStore = usePostStore()
const posts = [
  {
    id: 21,
    title: '数据库转移公告',
    content:
      '## 社区数据库转移公告：\n我们将于 3月26 对服务器数据转移，在此之后注册的账号会被清清空，所有帖子也会清空，转移完成后将开放新的注册通道我们会尽量将文件转移到新服务器，如转移失败将会转移到网盘上公开所有文件如有疑问请到QQ交流群：647379929管理员：酸菜味小咸鱼',
    views: 45,
    cover: '',
    creatorId: 1,
    plateId: 3,
    tags: [],
    type: 1,
    fileType: 0,
    downloadCount: 0,
    createdAt: '2025-04-06T13:27:24.872Z',
    updatedAt: '2025-04-21T16:54:22.609Z',
    top: 1,
    isLiked: false,
    likeCount: '0',
    isBaded: false,
    badCount: '0',
    isCollected: false,
    postVersionCount: '0',
    commentCount: '1',
    heat: '45',
    creator: {
      id: 1,
      nickname: '麻辣味小咸鱼',
      headImg:
        'r2.schub.top/c8b104be85a55831d2dad5243f234038da268861e2d7033c0cb35fe349606bca-Snipaste_2024-12-25_23-41-02.png',
    },
  },
  {
    id: 34,
    title: '文件测试',
    content: '帖子内容',
    views: 4,
    cover: '',
    creatorId: 1,
    plateId: 3,
    tags: [],
    type: 1,
    fileType: 0,
    downloadCount: 0,
    createdAt: '2025-04-15T17:26:07.882Z',
    updatedAt: '2025-04-19T15:07:48.394Z',
    top: 0,
    isLiked: false,
    likeCount: '0',
    isBaded: false,
    badCount: '0',
    isCollected: false,
    postVersionCount: '0',
    commentCount: '0',
    heat: '4',
    creator: {
      id: 1,
      nickname: '麻辣味小咸鱼',
      headImg:
        'r2.schub.top/c8b104be85a55831d2dad5243f234038da268861e2d7033c0cb35fe349606bca-Snipaste_2024-12-25_23-41-02.png',
    },
  },
]
</script>

<style scoped>
/* Add your styles here */
</style>
