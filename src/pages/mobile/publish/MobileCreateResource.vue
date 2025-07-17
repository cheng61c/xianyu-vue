<template>
  <div class="flex flex-col w-full space-y-4 pb-2">
    <div class="flex gap-2 items-center">
      <ScButton
        class="px-4 py-1 text-sm border border-gray"
        @click="$router.back()">
        返回
      </ScButton>
      <div class="text-lg font-semibold">编辑资源</div>
      <div v-if="!userStore.isLogin" class="text-error">
        请先登录后再发布内容
      </div>
    </div>

    <!-- 表单部分 -->
    <div class="space-y-4 text-sm">
      <!-- 标题 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            版本号，资源版本号">
          <span class="flex items-center gap-1">
            版本号 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <input
          v-model="versionData.version"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          placeholder="1.0.0" />
      </div>

      <!-- 标题 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            版本标题">
          <span class="flex items-center gap-1">
            标题 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <input
          v-model="versionData.title"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          placeholder="请输入标题" />
      </div>

      <!-- 游戏版本 -->
      <!-- 游戏版本 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="游戏版本，用于在不同版本的游戏中展示，建议根据实际情况选择合适的版本">
          <span class="flex items-center gap-1">
            适配的游戏版本 <span><CircleHelp :size="16" /></span>
          </span>
          <span>:</span>
        </label>

        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap gap-2 items-center">
            <span>插件版:</span>
            <template v-for="version in versionList" :key="version.id">
              <ScButton
                v-if="version.type === 'plugin'"
                class="px-4 py-1 text-sm"
                Border
                :activation="versionData.gameVersionIds.includes(version.id)"
                @click="toggleVersion(version.id)">
                {{ version.name }}
              </ScButton>
            </template>
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <span>联机版:</span>
            <template v-for="version in versionList" :key="version.id">
              <ScButton
                v-if="version.type === 'online'"
                class="px-4 py-1 text-sm"
                Border
                :activation="versionData.gameVersionIds.includes(version.id)"
                @click="toggleVersion(version.id)">
                {{ version.name }}
              </ScButton>
            </template>
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <span>原版:</span>
            <template v-for="version in versionList" :key="version.id">
              <ScButton
                v-if="version.type === 'original'"
                class="px-4 py-1 text-sm"
                Border
                :activation="versionData.gameVersionIds.includes(version.id)"
                @click="toggleVersion(version.id)">
                {{ version.name }}
              </ScButton>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loaderData">
      <ScUploadFile
        :typeid="postInfo.fileType"
        :loadFiles="uploadedFiles"
        @uploaded="setFileIds" />
    </div>

    <!-- 编辑器 -->
    <div v-if="!loaderData">
      <TipTap v-model="versionData.content" />
    </div>

    <!-- 发布按钮 -->
    <div class="text-right">
      <button
        class="px-6 py-2 rounded-lg"
        :class="{
          'bg-active text-active-content hover:bg-active/80  cursor-pointer':
            userStore.isLogin === true,
          'bg-active/60 text-active-content/60  cursor-not-allowed tooltip tooltip-left':
            userStore.isLogin === false,
        }"
        data-tip="请先登录后再发布内容"
        @click="submitVersiont"
        :disabled="userStore.isLogin === false || loader">
        {{ versionData.id ? '更新版本' : '发布版本' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Api } from '@/types'
import { onMounted, ref } from 'vue'
import { CircleHelp } from 'lucide-vue-next'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import type { Post, PostCreateVersionDto } from '@/types/Post'
import { useToast } from 'vue-toastification'
import ScButton from '@/components/common/ScButton.vue'
import ScUploadFile from '@/components/common/ScUploadFile.vue'
import { postApi, versionApi } from '@/apis'
import type { Version } from '@/types/version'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/module/user/userStore'
import type { DocumentVersion } from '@/types/DocumentVersion'
import { formatImageSrcsInHtml } from '@/utils/regex'

const props = defineProps({
  post: {
    type: Object as () => Post | null,
    default: null,
  },
})

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()
const versionList = ref<Version[]>([]) // 版本列表
const postInfo = ref<Post>({} as Post) // 帖子详情
const loader = ref(false) // 加载状态
const loaderData = ref(true) // 编辑器加载状态
const uploadedFiles = ref<{ name: string; id: number; size: number }[]>([]) // 已上传的文件ID

// 帖子表单
const versionData = ref<PostCreateVersionDto>({
  id: 0,
  title: '',
  version: '',
  content: '',
  files: [],
  postId: 0,
  gameVersionIds: [],
})

// 切换某个版本的选中状态
const toggleVersion = (id: number) => {
  const index = versionData.value.gameVersionIds.indexOf(id)
  if (index === -1) {
    versionData.value.gameVersionIds.push(id)
  } else {
    versionData.value.gameVersionIds.splice(index, 1)
  }
}

const setFileIds = (ids: number[]) => {
  console.log('设置文件ID:', ids)

  versionData.value.files = ids
}

// 提交
const submitVersiont = () => {
  if (!versionData.value.title) {
    toast.error('请输入版本标题')
    return
  }
  if (!versionData.value.version) {
    toast.error('请输入版本号')
    return
  }
  if (!versionData.value.content) {
    toast.error('请输入版本内容')
    return
  }

  loader.value = true

  console.log('提交版本数据:', versionData.value.id)

  postApi[versionData.value.id ? 'updateVersion' : 'createVersion'](
    versionData.value
  )
    .then((res: Api) => {
      const data = res.data
      if (data.code == 200) {
        toast.success('版本发布成功')
        // 清空表单
        versionData.value = {
          title: '',
          version: '',
          content: '',
          files: [],
          postId: 0,
          gameVersionIds: [],
        }
        loader.value = false
        router.back()
      }
    })
    .catch((error) => {
      toast.error('发布失败: ' + error.msg)
      loader.value = false
    })
}

onMounted(async () => {
  if (props.post) {
    versionData.value.postId = props.post.id
    postInfo.value = props.post
  }

  if (router.currentRoute.value.query.resourceId) {
    const resourceId = Number(router.currentRoute.value.query.resourceId)
    const res = await postApi.getResourceDetail(resourceId)

    if (res.data.code == 200) {
      const data = res.data.data as DocumentVersion
      versionData.value = {
        id: data.id,
        title: data.title,
        version: data.version,
        content: formatImageSrcsInHtml(data.content),
        files: data.files.map((file) => file.id),
        postId: data.postId,
        gameVersionIds: data.gameVersionIds || [],
      }
      uploadedFiles.value = data.files.map((file) => ({
        name: file.filename,
        id: file.id,
        size: +file.size,
      }))
    }
    loaderData.value = false
  } else {
    loaderData.value = false
  }

  versionApi.getVersion().then((res: Api) => {
    const data = res.data
    if (data.code == 200) {
      versionList.value = data.data
    }
  })
})
</script>
