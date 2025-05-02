<template>
  <div
    class="flex flex-col w-full h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar p-4 space-y-4"
  >
    <!-- 表单部分 -->
    <div class="space-y-4 text-sm">
      <!-- 标题 -->
      <div class="flex items-center gap-2">
        <label class="w-24 text-right">标题：</label>
        <input
          v-model="title"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入标题"
        />
      </div>

      <!-- 模式选择 -->
      <div class="flex items-center gap-2">
        <label class="w-24 text-right">模式选择：</label>
        <div class="flex gap-2">
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="mode === 'post'"
            :border="true"
            @click="mode = 'post'"
          >
            帖子
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="mode === 'server'"
            :border="true"
            @click="mode = 'server'"
          >
            服务器
          </ScButton>
        </div>
      </div>

      <!-- 发送到板块 -->
      <div v-if="mode === 'post'" class="flex items-center gap-2">
        <label class="w-24 text-right">选择板块：</label>
        <ScButton
          v-for="b in plateList"
          :key="b.id"
          class="px-4 py-1 text-sm"
          :activation="postData.plateId === b.id"
          @click="setPlate(b)"
          :icon="b.type === 1 ? FileText : Package"
          :border="true"
        >
          {{ b.name }}
        </ScButton>
      </div>

      <!-- 文件类型 -->
      <div
        v-if="postData.type === 2 && mode === 'post'"
        class="flex items-center gap-2 flex-wrap"
      >
        <label class="w-24 text-right">文件类型：</label>
        <div class="flex gap-2 flex-wrap">
          <ScButton
            v-for="type in configStore.fileTypes"
            :key="type.value"
            class="px-4 py-1 text-sm"
            :activation="postData.fileType === type.value"
            :border="true"
            @click="postData.fileType = type.value"
          >
            {{ type.label }}
          </ScButton>
        </div>
      </div>

      <!-- 是否关联帖子开关 -->
      <div
        v-if="postData.type === 2 && mode === 'post'"
        class="flex items-center gap-2"
      >
        <label class="w-24 text-right">关联帖子：</label>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="checkbox"
            type="checkbox"
            v-model="enablePostRelation"
            class="peer hidden"
          />
          <label
            for="checkbox"
            class="w-4 h-4 flex justify-center items-center border rounded cursor-pointer peer-checked:bg-blue-600 peer-checked:border-blue-600"
          >
            <Check v-if="enablePostRelation" />
          </label>
          <span class="text-sm text-background-content">启用关联帖子选择</span>
        </label>
      </div>

      <!-- 穿梭框选择器 -->
      <div
        v-if="postData.type === 2 && mode === 'post' && enablePostRelation"
        class="flex items-start gap-2"
      >
        <label class="w-24 text-right mt-2"></label>
        <div class="flex gap-6 w-full max-w-3xl">
          <!-- 左侧搜索与结果 -->
          <div class="flex-1">
            <input
              v-model="relatedSearch"
              type="text"
              placeholder="搜索帖子标题"
              class="w-full mb-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <div
              class="border border-gray rounded-lg p-2 h-[180px] overflow-y-auto space-y-1 text-sm"
            >
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="px-2 py-1 cursor-pointer rounded hover:bg-blue-100 transition"
                @click="addPost(post)"
              >
                {{ post.title }}（{{ post.creator.nickname }}）
              </div>
              <div
                v-if="filteredPosts.length === 0"
                class="text-gray-400 text-center py-2"
              >
                没有匹配的帖子
              </div>
            </div>
          </div>

          <!-- 右侧已选 -->
          <div class="flex-1">
            <div
              class="border border-gray rounded-lg p-2 h-[220px] overflow-y-auto space-y-1 text-sm"
            >
              <div
                v-for="post in selectedPosts"
                :key="post.id"
                class="px-2 py-1 flex justify-between items-center bg-blue-50 rounded"
              >
                <span>{{ post.title }}（{{ post.creator.nickname }}）</span>
                <button
                  class="text-red-500 hover:underline text-xs"
                  @click="removePost(post.id)"
                >
                  移除
                </button>
              </div>
              <div
                v-if="selectedPosts.length === 0"
                class="text-gray-400 text-center py-2"
              >
                暂无已选帖子
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务器 IP -->
      <div v-if="mode === 'server'" class="flex items-center gap-2">
        <label class="w-24 text-right">服务器 IP：</label>
        <input
          v-model="serverData.url"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入服务器 IP"
        />
      </div>
    </div>

    <!-- 编辑器 -->
    <div>
      <TipTap v-model="postContent" />
    </div>

    <!-- 发布按钮 -->
    <div class="text-right mt-2">
      <button
        class="bg-active text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        @click="submitPost"
      >
        发布
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Api } from '@/types'
import { onMounted, ref } from 'vue'
import { FileText, Package, Check } from 'lucide-vue-next'
import TipTap from '@/components/TipTap.vue'
import type { Post, SelectedPost } from '@/types/Post'
import type PostDto from '@/types/PostDto'
import { useToast } from 'vue-toastification'
import { usePostStore } from '@/stores/postStore'
import { useConfigStore } from '@/stores/configStore'
import type { Plate } from '@/types/Plate'
import ScButton from '@/components/ScButton.vue'

const toast = useToast()
const postStore = usePostStore()
const configStore = useConfigStore()

const props = defineProps({
  post: {
    type: Object as () => Post,
    required: false,
  },
})
const plateList = ref<Plate[]>([]) // 板块列表

// 表单
const postContent = ref('') // 帖子内容
const title = ref('') // 标题
const mode = ref<'post' | 'server'>('post') // 模式选择
const enablePostRelation = ref(false) // 是否启用关联帖子选择
const relatedSearch = ref('') // 关联帖子搜索
const selectedPosts = ref<SelectedPost[]>([]) // 关联帖子列表
const filteredPosts = ref<SelectedPost[]>([]) // 过滤后的帖子列表

const postData = ref<PostDto>({
  id: 0,
  title: '',
  plateId: 0,
  content: '',
  cover: '',
  type: 1,
  fileType: 0,
  dependencies: [],
})
const serverData = ref({
  title: '',
  description: '',
  url: '',
  versionId: 1,
}) // 服务器数据

const setPlate = (plate: Plate) => {
  postData.value.plateId = plate.id
  postData.value.type = plate.type
}

const addPost = (post: SelectedPost) => {
  if (!selectedPosts.value.find((s) => s.id === post.id)) {
    selectedPosts.value.push(post)
  }
}

const removePost = (id: number) => {
  selectedPosts.value = selectedPosts.value.filter((p) => p.id !== id)
}

// 提交
const submitPost = () => {
  if (!postData.value.title) {
    toast.error('标题不能为空')
    return
  }
  if (!postData.value.content) {
    toast.error('内容不能为空')
    return
  }
  if (postData.value.type === 1 && !postData.value.plateId) {
    toast.error('请选择板块')
    return
  }
}
onMounted(() => {
  if (props.post) {
    postData.value = props.post
  }

  plateList.value = Array.from(
    new Map(
      Object.values(postStore.plate)
        .flat()
        .map((item) => [item.id, item])
    ).values()
  )
})
</script>
