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

        <div class="flex flex-wrap gap-2">
          <ScButton
            v-for="version in versionList"
            :key="version.id"
            class="px-4 py-1 text-sm"
            Border
            :activation="versionData.gameVersionIds.includes(version.id)"
            @click="toggleVersion(version.id)">
            {{ version.name }}
          </ScButton>
        </div>
      </div>
    </div>

    <div>
      <ScUploadFile :typeid="postInfo.fileType" @uploaded="setFileIds" />
    </div>

    <!-- 编辑器 -->
    <div>
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
        :disabled="userStore.isLogin === false">
        发布
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Api } from '@/types'
import { onMounted, ref } from 'vue'
import { CircleHelp } from 'lucide-vue-next'
import TipTap from '@/components/tiptap/TipTap.vue'
import type { Post, PostCreateVersionDto } from '@/types/Post'
import { useToast } from 'vue-toastification'
import ScButton from '@/components/ScButton.vue'
import ScUploadFile from '@/components/ScUploadFile.vue'
import { postApi, versionApi } from '@/apis'
import type { Version } from '@/types/version'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()
const versionList = ref<Version[]>([]) // 版本列表
const postInfo = ref<Post>({} as Post) // 帖子详情

// 帖子表单
const versionData = ref<PostCreateVersionDto>({
  title: '',
  version: '',
  content: '',
  files: [],
  postId: 0,
  gameVersionIds: [],
})

// 切换某个版本的选中状态
function toggleVersion(id: number) {
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

  postApi
    .createVersion(versionData.value)
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
        router.back()
      }
    })
    .catch((error) => {
      toast.error('发布失败: ' + error.msg)
    })
}

onMounted(() => {
  if (router.currentRoute.value.query.postId) {
    const postId = Number(router.currentRoute.value.query.postId)
    versionData.value.postId = postId
    postApi.getPostDetail(postId).then((res: Api) => {
      const data = res.data
      if (data.code == 200) {
        postInfo.value = data.data
      }
    })
  }

  versionApi.getVersion().then((res: Api) => {
    const data = res.data
    if (data.code == 200) {
      versionList.value = data.data
    }
  })
})
</script>
