<template>
  <div
    class="flex flex-col w-full h-[calc(100vh-4rem)] overflow-auto no-scrollbar p-4 space-y-4"
  >
    <div class="flex gap-2">
      <ScButton
        class="px-4 py-1 text-sm border border-gray"
        @click="$emit('close')"
      >
        返回
      </ScButton>
      <div class="text-lg font-semibold">编辑帖子</div>
    </div>

    <!-- 表单部分 -->
    <div class="space-y-4 text-sm">
      <!-- 标题 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            帖子标题，帖子标题会显示在游戏内社区的列表中，建议使用简短的标题，便于用户快速搜索"
        >
          <span class="flex items-center gap-1">
            标题 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <input
          v-model="title"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          placeholder="请输入标题"
        />
      </div>

      <!-- 模式选择 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="模式选择，用于选择发布帖子或服务器，不同模式下的表单内容会有所不同"
        >
          <span class="flex items-center gap-1">
            模式选择 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <div class="flex gap-2">
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="mode === 'post'"
            Border
            @click="mode = 'post'"
          >
            帖子
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="mode === 'server'"
            Border
            @click="mode = 'server'"
          >
            服务器
          </ScButton>
        </div>
      </div>

      <!-- 发送到板块 -->
      <div v-if="mode === 'post'" class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            选择要发送到的板块，板块类型会影响帖子类型的选择，文件类型的帖子只能发送到文件板块"
        >
          <span class="flex items-center gap-1">
            关联帖子 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <ScButton
          v-for="b in plateList"
          :key="b.id"
          class="px-4 py-1 text-sm"
          :activation="postData.plateId === b.id"
          @click="setPlate(b)"
          :icon="b.type === 1 ? FileText : Package"
          Border
        >
          {{ b.name }}
        </ScButton>
      </div>

      <!-- 文件类型 -->
      <div
        v-if="postData.type === 2 && mode === 'post'"
        class="flex items-center gap-2 flex-wrap"
      >
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            选择文件类型，文件类型会影响文件的上传方式和显示方式，且一个帖子中只能存在一种文件类型，建议根据实际情况选择合适的文件类型"
        >
          <span class="flex items-center gap-1">
            文件类型 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <div class="flex gap-2 flex-wrap">
          <ScButton
            v-for="type in configStore.fileTypes"
            :key="type.value"
            class="px-4 py-1 text-sm"
            :activation="postData.fileType === type.value"
            Border
            @click="postData.fileType = type.value"
          >
            {{ type.label }}
          </ScButton>
        </div>
        <span
          v-if="postData.fileType == 7"
          class="flex gap-1 text-error items-center"
          ><CircleAlert :size="16" />使用该 其他
          选项时，上传的资源将不会在游戏中显示</span
        >
      </div>

      <!-- 是否关联帖子开关 -->
      <div
        v-if="postData.type === 2 && mode === 'post'"
        class="flex items-center gap-2"
      >
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            关联帖子，当该帖子所使用的文件需要依赖其他帖子中的文件时使用，启用后可以选择其他帖子进行关联，便于快速查找和使用"
        >
          <span class="flex items-center gap-1">
            关联帖子 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="checkbox"
            type="checkbox"
            v-model="enablePostRelation"
            class="peer hidden"
          />
          <label
            for="checkbox"
            class="w-4 h-4 flex justify-center items-center border rounded cursor-pointer peer-checked:bg-active peer-checked:border-active peer-checked:text-active-content transition"
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
              class="w-full mb-2 px-3 py-1.5 border border-gray-content rounded-lg text-sm focus:ring-2 focus:ring-active outline-none"
            />
            <div
              class="border border-gray-content rounded-lg p-2 h-[180px] overflow-y-auto space-y-1 text-sm"
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
              class="border border-gray-content rounded-lg p-2 h-[220px] overflow-y-auto space-y-1 text-sm"
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
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            你的服务器地址，这将用于在游戏内连接到你的服务器，通常是 IP:端口号"
        >
          <span class="flex items-center gap-2">
            服务器 IP <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <input
          v-model="serverData.url"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          placeholder="请输入服务器 IP "
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
import {
  FileText,
  Package,
  Check,
  CircleHelp,
  CircleAlert,
} from 'lucide-vue-next'
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
const postContent = ref(`<p>
          That's a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>`) // 帖子内容
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
