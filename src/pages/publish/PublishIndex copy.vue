<template>
  <div class="flex flex-col w-full h-full p-4 pt-16 space-y-4">
    <!-- 表单部分 -->
    <div class="space-y-4 text-sm">
      <!-- 标题 -->
      <div class="flex items-center gap-2">
        <label class="w-24 text-right">标题：</label>
        <input
          v-model="title"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入标题" />
      </div>

      <!-- 模式选择 -->
      <div class="flex items-center gap-2">
        <label class="w-24 text-right">模式选择：</label>
        <div class="flex gap-2">
          <button
            class="px-4 py-1 rounded-lg border text-sm transition-all"
            :class="
              mode === 'post'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            "
            @click="mode = 'post'">
            帖子
          </button>
          <button
            class="px-4 py-1 rounded-lg border text-sm transition-all"
            :class="
              mode === 'server'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            "
            @click="mode = 'server'">
            服务器
          </button>
        </div>
      </div>

      <!-- 发送到板块 -->
      <div v-if="mode === 'post'" class="flex items-center gap-2">
        <label class="w-24 text-right">选择板块：</label>
        <button
          v-for="b in boardList"
          :key="b.id"
          class="px-4 py-1 rounded-lg border text-sm transition-all"
          :class="
            selectedBoard?.id === b.id
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          "
          @click="
            () => {
              selectedBoard = b
              handleBoardChange()
            }
          ">
          {{ b.name }}
        </button>
      </div>

      <!-- 文件类型 -->
      <div
        v-if="selectedBoard?.type === 2 && mode === 'post'"
        class="flex items-center gap-2 flex-wrap">
        <label class="w-24 text-right">文件类型：</label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="type in fileTypes"
            :key="type.value"
            class="px-4 py-1 rounded-lg border text-sm transition-all"
            :class="
              fileType === type.value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            "
            @click="fileType = type.value">
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 是否关联帖子开关 -->
      <div
        v-if="selectedBoard?.type === 2 && mode === 'post'"
        class="flex items-center gap-2">
        <label class="w-24 text-right">关联帖子：</label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="enablePostRelation" class="w-4 h-4" />
          <span class="text-sm text-gray-700">启用关联帖子选择</span>
        </label>
      </div>

      <!-- 穿梭框选择器 -->
      <div
        v-if="
          selectedBoard?.type === 2 && mode === 'post' && enablePostRelation
        "
        class="flex items-start gap-2">
        <label class="w-24 text-right mt-2"></label>
        <div class="flex gap-6 w-full max-w-3xl">
          <!-- 左侧搜索与结果 -->
          <div class="flex-1">
            <input
              v-model="relatedSearch"
              type="text"
              placeholder="搜索帖子标题"
              class="w-full mb-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
            <div
              class="border rounded-lg p-2 h-[180px] overflow-y-auto space-y-1 text-sm">
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="px-2 py-1 cursor-pointer rounded hover:bg-blue-100 transition"
                @click="addPost(post)">
                {{ post.title }}（{{ post.creator.nickname }}）
              </div>
              <div
                v-if="filteredPosts.length === 0"
                class="text-gray-400 text-center py-2">
                没有匹配的帖子
              </div>
            </div>
          </div>

          <!-- 右侧已选 -->
          <div class="flex-1">
            <div
              class="border rounded-lg p-2 h-[220px] overflow-y-auto space-y-1 text-sm">
              <div
                v-for="post in selectedPosts"
                :key="post.id"
                class="px-2 py-1 flex justify-between items-center bg-blue-50 rounded">
                <span>{{ post.title }}（{{ post.creator.nickname }}）</span>
                <button
                  class="text-red-500 hover:underline text-xs"
                  @click="removePost(post.id)">
                  移除
                </button>
              </div>
              <div
                v-if="selectedPosts.length === 0"
                class="text-gray-400 text-center py-2">
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
          v-model="serverIp"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入服务器 IP" />
      </div>

      <!-- 版本选择器 -->
      <div
        v-if="(selectedBoard?.type !== 1 && selectedBoard) || mode === 'server'"
        class="flex items-start gap-2">
        <label class="w-24 text-right mt-1">适配版本：</label>
        <div class="flex gap-y-2 gap-x-6">
          <template
            v-for="(group, groupName) in versionGroups"
            :key="groupName">
            <div class="flex gap-2">
              <div class="text-gray-500 font-medium">{{ groupName }}:</div>
              <div class="flex flex-col gap-2">
                <label
                  v-for="item in group"
                  :key="item.id"
                  class="px-3 py-1 border rounded-lg cursor-pointer text-sm transition-all"
                  :class="
                    selectedVersions.includes(item.id)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  ">
                  <input
                    type="checkbox"
                    class="hidden"
                    :value="item.id"
                    v-model="selectedVersions" />
                  {{ item.name }}
                </label>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 编辑器 -->
    <div>
      <TipTap v-model="content" />
    </div>

    <!-- 发布按钮 -->
    <div class="text-right mt-2">
      <button
        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        @click="submitPost">
        发布
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TipTap from '@/components/tiptap/TipTap.vue'

const content = ref('<h1>标题</h1><p>内容</p>')
const title = ref('')
const postType = ref<'1' | '2'>('1') // 1 = 交流, 2 = 资源
const fileType = ref<
  'archive' | 'furniture' | 'texture' | 'skin' | 'mod' | 'other'
>('archive')
const mode = ref<'post' | 'server'>('post')
const serverIp = ref('')

// 当mode为server是需要切换请求接口为/api/server-post
// {
//   "title": "生存服务器",
//   "description": "禁止开挂",   这里对应md内容
//   "url": "127.0.0.1:28887",
//   "versionId": 1  这里的id对应selectedVersions
// }

const selectedBoard = ref<Board | null>(null)
// 动态板块列表
const boardList = ref<Board[]>([
  {
    id: 3,
    name: '综合交流',
    description: '类型为1的测试板块',
    type: 1,
    postCount: '3',
  },
  {
    id: 2,
    name: '测试资源板块二',
    description: '交流板块介绍',
    type: 2,
    postCount: '2',
  },
  {
    id: 1,
    name: '资源大厅',
    description: '类型为2的测试板块',
    type: 2,
    postCount: '2',
  },
])

// 此为固定内容
const fileTypes: FileTypes[] = [
  { value: 'archive', label: '存档' },
  { value: 'furniture', label: '家具' },
  { value: 'texture', label: '材质' },
  { value: 'skin', label: '皮肤' },
  { value: 'mod', label: '模组' },
  { value: 'other', label: '其他' },
]

function submitPost() {}

// 选中板块时自动修正帖子类型
function handleBoardChange() {
  if (selectedBoard.value?.type === 1 && postType.value === '2') {
    postType.value = '1'
  }
}

interface VersionItem {
  id: number
  name: string
  onlineVersion: string | null
  apiVersion: string | null
  gameVersion: string
}

// 版本选择项，获取接口/api/version/list
const versionOptionsRaw: VersionItem[] = [
  {
    id: 1,
    name: 'api1.50',
    onlineVersion: null,
    gameVersion: '2.3',
    apiVersion: '1.50',
  },
  {
    id: 2,
    name: 'x23.06.02',
    onlineVersion: 'x23.06.02',
    gameVersion: '2.3',
    apiVersion: null,
  },
  {
    id: 3,
    name: '2.4',
    onlineVersion: null,
    gameVersion: '2.4',
    apiVersion: null,
  },
  {
    id: 4,
    name: '2.3',
    onlineVersion: null,
    gameVersion: '2.3',
    apiVersion: null,
  },
  {
    id: 5,
    name: 'api1.80',
    onlineVersion: null,
    gameVersion: '2.3',
    apiVersion: '1.80',
  },
]

const selectedVersions = ref<number[]>([])

const versionGroups = computed(() => {
  const allGroups = {
    联机版: versionOptionsRaw.filter((v) => v.onlineVersion),
    插件版: versionOptionsRaw.filter((v) => !v.onlineVersion && v.apiVersion),
    原版: versionOptionsRaw.filter((v) => !v.onlineVersion && !v.apiVersion),
  }

  if (mode.value === 'server') {
    // 只保留联机版
    return { 联机版: allGroups['联机版'] }
  }

  return allGroups
})

// 监听模式变化，当模式选择为服务器时，清除非“联机版”的版本 ID
// watch([mode, selectedVersions], ([newMode]) => {
//   if (newMode === 'server') {
//     // 清除非“联机版”的版本 ID
//     const onlineIds = versionGroups.value['联机版'].map((v) => v.id)
//     selectedVersions.value = selectedVersions.value.filter((id) => onlineIds.includes(id))
//   }
// })

// 帖子依赖
const relatedSearch = ref('')
// 该数据搜索接口为/api/post/search，type必须为2
const allPosts = ref([
  {
    id: 17,
    title: '歪比巴布',
    creator: { id: 1, nickname: '麻辣味小咸鱼' },
  },
  {
    id: 18,
    title: '文件贴',
    creator: { id: 1, nickname: '麻辣味小咸鱼' },
  },
  {
    id: 13,
    title: '歪比巴布123123',
    creator: { id: 1, nickname: '麻辣味小咸鱼' },
  },
  {
    id: 1,
    title: '歪比巴布',
    creator: { id: 1, nickname: '麻辣味小咸鱼' },
  },
])

const selectedPosts = ref<typeof allPosts.value>([])
const enablePostRelation = ref(false)

const filteredPosts = computed(() =>
  allPosts.value.filter(
    (p) =>
      p.title
        .toLowerCase()
        .includes(relatedSearch.value.trim().toLowerCase()) &&
      !selectedPosts.value.find((s) => s.id === p.id)
  )
)

function addPost(post: {
  id: number
  title: string
  creator: { id: number; nickname: string }
}) {
  if (!selectedPosts.value.find((s) => s.id === post.id)) {
    selectedPosts.value.push(post)
  }
}

function removePost(id: number) {
  selectedPosts.value = selectedPosts.value.filter((p) => p.id !== id)
}

interface Board {
  id: number
  name: string
  description: string
  type: number // 1 = 交流, 2 = 资源
  postCount: string
}

interface FileTypes {
  value: 'archive' | 'furniture' | 'texture' | 'skin' | 'mod' | 'other'
  label: string
}
</script>
