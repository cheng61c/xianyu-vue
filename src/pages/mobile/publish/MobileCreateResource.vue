<template>
  <div
    class="flex flex-col w-[100dvw] h-[100dvh] space-y-4 pb-2 overflow-y-auto">
    <div class="flex h-12 gap-2 items-center">
      <ScButton
        class=""
        :icon="ChevronLeft"
        :iconSize="22"
        @click="$router.back()">
      </ScButton>
      <div class="text-lg font-semibold" @click="$router.back()">
        {{ $t('b.bian-ji-zi-yuan') }}
      </div>
      <div v-if="!userStore.isLogin" class="text-error">
        {{ $t('d.qing-xian-deng-lu-hou-zai-fa-bu-nei-rong') }}
      </div>
    </div>

    <div class="space-y-4 text-sm px-4">
      <div class="flex flex-col w-full space-y-4 pb-2">
        <!-- 标题 -->
        <div class="flex items-center gap-2">
          <label
            class="w-24 flex justify-between items-center tooltip tooltip-right"
            :data-tip="$t('d.ban-ben-hao-zi-yuan-ban-ben-hao')">
            <span class="flex items-center gap-1">
              {{ $t('d.ban-ben-hao') }} <span><CircleHelp :size="16" /></span>
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
            :data-tip="$t('t.ban-ben-biao-ti')">
            <span class="flex items-center gap-1">
              {{ $t('b.biao-ti') }} <span><CircleHelp :size="16" /></span>
            </span>

            <span>:</span>
          </label>
          <input
            v-model="versionData.title"
            type="text"
            class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
            :placeholder="$t('d.qing-shu-ru-biao-ti')" />
        </div>

        <!-- 游戏版本 -->
        <div class="flex flex-col gap-2">
          <label
            class="w-32 flex items-center tooltip tooltip-right"
            :data-tip="
              $t(
                't.you-xi-ban-ben-yong-yu-zai-bu-tong-ban-ben-de-you-xi-zhong-zhan-shi-jian-yi-gen-ju-shi-ji-qing-kuang-xuan-ze-he-shi-de-ban-ben'
              )
            ">
            <span class="flex items-center gap-1">
              {{ $t('f.shi-pei-de-you-xi-ban-ben') }}
              <span><CircleHelp :size="16" /></span>
            </span>
            <span>:</span>
          </label>

          <div class="flex gap-2 flex-col">
            <div class="flex flex-wrap gap-2">
              <span>{{ $t('f.cha-jian-ban') }}</span>
              <template v-for="version in versionList" :key="version.id">
                <ScButton
                  v-if="version.type === 'plugin'"
                  Border
                  :activation="versionData.gameVersionIds.includes(version.id)"
                  @click="toggleVersion(version.id)">
                  {{ version.name }}
                </ScButton>
              </template>
            </div>
            <div class="flex flex-wrap gap-2">
              <span>{{ $t('f.lian-ji-ban') }}</span>
              <template v-for="version in versionList" :key="version.id">
                <ScButton
                  v-if="version.type === 'online'"
                  Border
                  :activation="versionData.gameVersionIds.includes(version.id)"
                  @click="toggleVersion(version.id)">
                  {{ version.name }}
                </ScButton>
              </template>
            </div>
            <div class="flex flex-wrap gap-2">
              <span>{{ $t('f.yuan-ban') }}</span>
              <template v-for="version in versionList" :key="version.id">
                <ScButton
                  v-if="version.type === 'original'"
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

      <!-- 帖子内容 -->
      <ScButton
        v-if="deviceStore.device == 1"
        @click="onTipTap"
        Border
        class="w-full">
        {{ $t('b.bian-xie-jie-shao') }}
      </ScButton>

      <!-- 发布按钮 -->
      <div class="flex justify-end my-2 px-4">
        <ScButton
          activation
          :disabled="userStore.isLogin === false || loader"
          class="px-6 py-2 hover:bg-active/80"
          @click="submitVersiont"
          :loading="loader">
          {{
            versionData.id ? $t('b.geng-xin-ban-ben') : $t('b.fa-bu-ban-ben')
          }}
        </ScButton>
      </div>
    </div>
  </div>

  <ScDrawer v-model="isOpen" position="bottom">
    <div v-if="versionData.content !== null" class="bg-background rounded-t-lg">
      <TipTap
        v-model="versionData.content"
        :class="deviceStore.device == 1 ? 'mobileTipTap' : ''" />
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import type { Api } from '@/types'
import { onMounted, ref } from 'vue'
import { CircleHelp, ChevronLeft } from 'lucide-vue-next'
import type { Post, PostCreateVersionDto } from '@/types/Post'
import { useToast } from 'vue-toastification'
import { postApi, versionApi } from '@/apis'
import type { Version } from '@/types/version'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/module/user/userStore'
import type { DocumentVersion } from '@/types/DocumentVersion'

import { useDeviceStore } from '@/stores/global/deviceStore'

import ScButton from '@/components/common/ScButton.vue'
import ScUploadFile from '@/components/common/ScUploadFile.vue'
import ScDrawer from '@/components/common/ScDrawer.vue'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  post: {
    type: Object as () => Post | null,
    default: null,
  },
})
const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()
const router = useRouter()
const versionList = ref<Version[]>([]) // 版本列表
const postInfo = ref<Post>({} as Post) // 帖子详情
const loader = ref(false) // 加载状态
const loaderData = ref(true) // 编辑器加载状态
const uploadedFiles = ref<{ name: string; id: number; size: number }[]>([]) // 已上传的文件ID
const isOpen = ref(false) // 抽屉状态
const deviceStore = useDeviceStore()

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
const versionContent = ref<string | null>(null) // 帖子内容

const onTipTap = () => {
  versionData.value.content = versionData.value.content ?? ''
  isOpen.value = true
}

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
    toast.error(t('t.qing-shu-ru-ban-ben-biao-ti'))
    return
  }
  if (!versionData.value.version) {
    toast.error(t('t.qing-shu-ru-ban-ben-hao'))
    return
  }
  if (!versionData.value.content) {
    toast.error(t('t.qing-shu-ru-ban-ben-nei-rong'))
    return
  }
  if (!versionData.value.content) {
    toast.error(t('t.nei-rong-bu-neng-wei-kong'))
    return
  }
  if (!versionData.value.content.trim()) {
    toast.error(t('t.nei-rong-bu-neng-wei-kong'))
    return
  }

  if (versionData.value.id == 0) {
    delete versionData.value.id // 确保新建时不包含ID
  }
  loader.value = true
  console.log('提交版本数据:', versionData.value.id)

  postApi[versionData.value.id ? 'updateVersion' : 'createVersion'](
    versionData.value
  )
    .then((res: Api) => {
      const data = res.data
      if (data.code == 200) {
        toast.success(t('t.ban-ben-fa-bu-cheng-gong'))
        // 清空表单
        versionData.value = {
          title: '',
          version: '',
          content: '',
          files: [],
          postId: 0,
          gameVersionIds: [],
        }
        versionContent.value = ''
        loader.value = false
        router.back()
      }
    })
    .catch((error) => {
      toast.error(t('t.fa-bu-shi-bai') + error.msg)
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
        content: data.content,
        files: data.files.map((file) => file.id),
        postId: data.postId,
        gameVersionIds: data.gameVersionIds || [],
      }
      versionData.value.content = data.content
      uploadedFiles.value = data.files.map((file) => ({
        name: file.filename,
        id: file.id,
        size: +file.size,
      }))
      toast.success(t('t.ban-ben-fa-bu-cheng-gong'))
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
