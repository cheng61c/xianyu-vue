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
        {{ isEdit ? '编辑' : '创建' }}帖子
      </div>
      <div v-if="!userStore.isLogin" class="text-error">
        请先登录后再发布帖子
      </div>
    </div>

    <!-- 表单部分 -->
    <div class="space-y-4 text-sm px-4">
      <!-- 标题 -->
      <div class="items-center gap-2 space-y-2">
        <label
          class="w-24 flex items-center tooltip tooltip-right"
          data-tip="
            帖子标题，帖子标题会显示在游戏内社区的列表中，建议使用简短的标题，便于用户快速搜索">
          <span class="flex items-center gap-1">
            标题 <span><CircleHelp :size="16" /></span>
          </span>
        </label>
        <input
          v-model="title"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          placeholder="请输入标题" />
      </div>

      <!-- 模式选择 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="模式选择，用于选择发布帖子或服务器，不同模式下的表单内容会有所不同">
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
            @click="mode = 'post'">
            帖子
          </ScButton>
          <ScButton
            v-if="verifyPermissions([1, 2, 8, 9])"
            class="px-4 py-1 text-sm"
            :activation="mode === 'server'"
            Border
            @click="mode = 'server'">
            服务器
          </ScButton>
        </div>
      </div>

      <div
        v-if="mode === 'post' && verifyPermissions([1, 2, 6, 9])"
        class="flex items-center gap-2 flex-wrap">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="置顶选项，用于选择帖子在社区中的显示方式，置顶的帖子会在列表中优先显示，横幅公告和弹窗公告会在站内有特殊提示">
          <span class="flex items-center gap-1">
            置顶模式 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <div class="flex gap-2 flex-wrap">
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 0"
            Border
            @click="postData.top = 0">
            不置顶
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 1"
            Border
            @click="postData.top = 1">
            置顶
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 2"
            Border
            @click="postData.top = 2">
            横幅公告
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 3"
            Border
            @click="postData.top = 3">
            弹窗公告
          </ScButton>
          <span
            v-if="postData.top == 2"
            class="flex gap-1 text-green items-center">
            <CircleAlert :size="16" />
            使用"横幅公告"选项时，该帖子的标题将置顶在主页的页面顶端
          </span>
          <span
            v-if="postData.top == 3"
            class="flex gap-1 text-green items-center">
            <CircleAlert :size="16" />
            使用"弹窗公告"选项时，该帖子将在页面加载完成时弹出
          </span>
        </div>
      </div>

      <!-- 发送到板块 -->
      <div v-if="mode === 'post'" class="flex flex-wrap items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            选择要发送到的板块，板块类型会影响帖子类型的选择，文件类型的帖子只能发送到文件板块">
          <span class="flex items-center gap-1">
            选择板块 <span><CircleHelp :size="16" /></span>
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
          Border>
          {{ b.name }}
        </ScButton>
      </div>

      <!-- 文件类型 -->
      <div
        v-if="postData.type === 2 && mode === 'post'"
        class="flex items-center gap-2 flex-wrap">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            选择文件类型，文件类型会影响文件的上传方式和显示方式，且一个帖子中只能存在一种文件类型，建议根据实际情况选择合适的文件类型">
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
            @click="postData.fileType = type.value">
            {{ type.label }}
          </ScButton>
        </div>
        <span
          v-if="postData.fileType == 7"
          class="flex gap-1 text-error items-center">
          <CircleAlert :size="16" />
          使用"其他"选项时，上传的资源将不会在游戏中显示
        </span>
      </div>

      <!-- 是否关联帖子开关 -->
      <div
        v-if="postData.type === 2 && mode === 'post'"
        class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            关联帖子，当该帖子所使用的文件需要依赖其他帖子中的文件时使用，启用后可以选择其他帖子进行关联，便于快速查找和使用">
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
            class="peer hidden" />
          <label
            for="checkbox"
            class="w-4 h-4 flex justify-center items-center border rounded cursor-pointer peer-checked:bg-active peer-checked:border-active peer-checked:text-active-content transition">
            <Check v-if="enablePostRelation" />
          </label>
          <span class="text-sm text-background-content">启用关联帖子选择</span>
        </label>
      </div>

      <!-- 穿梭框选择器 -->
      <div
        v-if="postData.type === 2 && mode === 'post' && enablePostRelation"
        class="flex items-start gap-2">
        <div class="flex gap-6 w-full max-w-3xl">
          <!-- 左侧搜索与结果 -->
          <div class="flex-1">
            <input
              v-model="relatedSearch"
              type="text"
              placeholder="搜索帖子标题"
              class="w-full mb-2 px-3 py-1.5 border border-gray-content rounded-lg text-sm focus:ring-2 focus:ring-active outline-none" />
            <div
              class="border border-gray-content rounded-lg p-2 h-[180px] overflow-y-auto space-y-1 text-sm">
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
              class="border border-gray-content rounded-lg p-2 h-[220px] overflow-y-auto space-y-1 text-sm">
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
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            你的服务器地址，这将用于在游戏内连接到你的服务器，通常是 IP:端口号">
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
          @blur="connectionTest(serverData.url)" />

        <span
          class="text-info tooltip tooltip-right"
          data-tip="
        该测试只对ip有效，与端口号无关，请确保端口号已开放"
          v-if="pingLoding">
          测试延迟中...
        </span>
        <span
          class="tooltip tooltip-right"
          data-tip="
            该测试只对ip有效，与端口号无关，请确保端口号已开放"
          :class="{
            'text-green': pingAvgTime < 50 && pingAvgTime > 0,
            'text-yellow-500': pingAvgTime >= 50 && pingAvgTime < 100,
            'text-error': pingAvgTime >= 100 || pingAvgTime === -1,
          }"
          v-if="pingAvgTime != 0 && !pingLoding">
          {{ pingAvgTime }}ms
        </span>
      </div>

      <!-- 服务器提示 -->
      <div
        v-if="mode === 'server' && pingAvgTime != 0 && !pingLoding"
        class="flex items-center gap-2">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="checkbox"
            type="checkbox"
            v-model="pingEnsure"
            class="peer hidden" />
          <label
            for="checkbox"
            class="w-4 h-4 flex justify-center items-center border rounded cursor-pointer peer-checked:bg-active peer-checked:border-active peer-checked:text-active-content transition">
            <Check v-if="pingEnsure" />
          </label>
          <span class="text-sm text-error">
            检测到IP无法ping通，若已确定IP正常，请勾选
          </span>
        </label>
      </div>

      <!-- 服务器版本 -->
      <div v-if="mode === 'server'" class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          data-tip="
            选择服务器版本，服务器版本会影响游戏内的连接方式和功能，建议根据实际情况选择合适的版本">
          <span class="flex items-center gap-1">
            服务器版本 <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <ScButton
          v-for="version in versionList"
          :key="version.id"
          class="px-4 py-1 text-sm"
          Border
          :activation="serverData.versionId === version.id"
          @click="serverData.versionId = version.id">
          {{ version.name }}
        </ScButton>
      </div>

      <!-- 帖子内容 -->
      <ScButton
        v-if="deviceStore.device == 1"
        @click="onTipTap"
        Border
        class="w-full">
        编写文章
      </ScButton>
    </div>

    <!-- 编辑器 -->
    <div v-if="postContent !== null">
      <template v-if="deviceStore.device == 2">
        <TipTap v-model="postContent" />
      </template>
    </div>

    <!-- 发布按钮 -->
    <div class="flex justify-end my-2 px-4">
      <ScButton
        activation
        :disabled="userStore.isLogin === false || loader"
        class="px-6 py-2 hover:bg-active/80"
        @click="submitPost"
        :loading="loader">
        {{ isEdit ? '更新帖子' : '发布帖子' }}
      </ScButton>
    </div>
  </div>

  <ScDrawer v-model="isOpen" position="bottom">
    <div v-if="postContent !== null" class="bg-background rounded-t-lg">
      <TipTap
        v-model="postContent"
        :class="deviceStore.device == 1 ? 'mobileTipTap' : ''" />
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import type { Api } from '@/types'
import { onMounted, ref, watch } from 'vue'
import {
  FileText,
  Package,
  Check,
  CircleHelp,
  CircleAlert,
  ChevronLeft,
} from 'lucide-vue-next'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import type { Post, SelectedPost } from '@/types/Post'
import type PostDto from '@/types/PostDto'
import { useToast } from 'vue-toastification'
import { usePostStore } from '@/stores/module/post/postStore'
import { useConfigStore } from '@/stores/global/configStore'
import type { Plate } from '@/types/Plate'
import ScButton from '@/components/common/ScButton.vue'
import { postApi, pingApi, plateApi, versionApi, serverApi } from '@/apis'
import type { Version } from '@/types/version'
import { verifyPermissions } from '@/utils/verify'
import { useUserStore } from '@/stores/module/user/userStore'
import { useDeviceStore } from '@/stores/global/deviceStore'
import ScDrawer from '@/components/common/ScDrawer.vue'
import { useRouter } from 'vue-router'

const toast = useToast()
const postStore = usePostStore()
const configStore = useConfigStore()
const userStore = useUserStore()
const deviceStore = useDeviceStore()
const isOpen = ref(false)
const router = useRouter()

const onTipTap = () => {
  isOpen.value = true
}

const props = defineProps({
  post: {
    type: Object as () => Post | null,
  },
  isEdit: {
    type: Boolean,
  },
})
const plateList = ref<Plate[]>([]) // 板块列表
const versionList = ref<Version[]>([]) // 版本列表

// 表单
const postContent = ref<string | null>(null) // 帖子内容
const title = ref('') // 标题
const mode = ref<'post' | 'server'>('post') // 模式选择
const enablePostRelation = ref(false) // 是否启用关联帖子选择
const relatedSearch = ref('') // 关联帖子搜索
const selectedPosts = ref<SelectedPost[]>([]) // 关联帖子列表
const filteredPosts = ref<SelectedPost[]>([]) // 过滤后的帖子列表
const pingAvgTime = ref(0) // ping 延迟
const pingAuccess = ref(true) // ping 成功
const pingLoding = ref(false) // ping 加载中
const pingEnsure = ref(false) // ping 确认
const loader = ref(false) // 提交加载状态

// 帖子表单
const postData = ref<PostDto>({
  id: 0,
  title: '',
  plateId: 0,
  content: '',
  cover: '',
  type: 1,
  fileType: 0,
  top: 0,
  dependencies: [],
})
// 服务器表单
const serverData = ref({
  title: '',
  description: '',
  url: '',
  versionId: 0,
})

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
  if (!title.value.trim()) {
    toast.error('标题不能为空')
    return
  }
  if (postContent.value && !postContent.value.trim()) {
    toast.error('内容不能为空')
    return
  }

  if (mode.value === 'post') {
    if (postData.value.plateId === 0) {
      toast.error('请选择板块')
      return
    }
    if (postData.value.type === 2 && postData.value.fileType === 0) {
      toast.error('请选择文件类型')
      return
    }
    sendPsot()
  } else {
    if (!serverData.value.url.trim()) {
      toast.error('服务器地址不能为空')
      return
    }

    if (serverData.value.versionId === 0) {
      toast.error('请选择服务器版本')
      return
    }
    sendServer()
  }
}

const sendPsot = () => {
  if (postContent.value === null) {
    toast.error('内容不能为空')
    return
  }
  postData.value.title = title.value
  postData.value.content = postContent.value
  postData.value.dependencies = selectedPosts.value.map((p) => p.id)
  loader.value = true

  postApi[props.isEdit ? 'updatePost' : 'createPost'](
    formatPostBody(postData.value)
  )
    .then((res: Api) => {
      if (res.data.code === 200) {
        toast.success('发布成功' + res.data.data.id)
        loader.value = false
        router.back()
        if (!props.isEdit && postData.value.type == 2) {
          router.push({
            name: 'publishResource',
            query: {
              postId: res.data.data.id,
            },
            params: {
              postId: res.data.data.id,
            },
          })
          toast.success('请上传资源文件')
        }
      }
    })
    .catch((err) => {
      toast.error('发布失败' + err.msg)
      loader.value = false
    })
}

const sendServer = () => {
  if (postContent.value === null) {
    toast.error('内容不能为空')
    return
  }
  serverData.value.title = title.value
  serverData.value.description = postContent.value

  loader.value = true
  console.log('serverData', serverData.value)

  serverApi
    .createServer(serverData.value)
    .then((res: Api) => {
      if (res.data.code === 200) {
        toast.success('发布成功')
        loader.value = false
        window.history.back()
      }
    })
    .catch((err) => {
      toast.error('发布失败' + err.msg)
      loader.value = false
    })
}

// 测试服务器连接
const connectionTest = async (url: string) => {
  if (!url) {
    return
  }
  // 检查本地地址或局域网ip
  if (
    url.startsWith('localhost') ||
    url.startsWith('127.0.0.1') ||
    url.startsWith('192.168.')
  ) {
    toast.error('本地地址或局域网IP不支持')
    pingLoding.value = false
    return
  }

  pingLoding.value = true
  pingApi
    .ping(url.split(':')[0])
    .then((res: Api) => {
      const data = res.data.data as {
        success: boolean
        host: string
        avgTime: string
        packetLoss: string
      }
      if (data.success) {
        toast.success('连接成功')
      } else {
        toast.error('连接失败，请检查服务器地址')
        data.avgTime = '-1'
      }
      pingAvgTime.value = Number(data.avgTime)
      pingAuccess.value = data.success
      pingLoding.value = false
    })
    .catch(() => {
      toast.error('连接失败，请检查服务器地址')
      pingAvgTime.value = -1
      pingAuccess.value = false
      pingLoding.value = false
    })
}

const formatPostBody = (body: PostDto) => {
  if (body.id == 0 && !props.isEdit) delete body.id
  if (body.type == 1) {
    delete body.fileType
    delete body.dependencies
  }
  if (body.type == 2) {
    body.dependencies = selectedPosts.value.map((p) => p.id)
  } else {
    body.dependencies = []
  }
  return body
}

onMounted(() => {
  console.log('CreatePost mounted', props.post)

  if (props.post) {
    // 只拷贝需要的字段，并将 dependencies 转换为 number[]
    // postData.value = {
    //   ...props.post,
    //   dependencies: Array.isArray(props.post.dependencies)
    //     ? props.post.dependencies.map((d: any) =>
    //         typeof d === 'object' && d.id ? d.id : d
    //       )
    //     : [],
    // }
    postData.value = {
      id: props.post.id,
      title: props.post.title,
      plateId: props.post.plateId,
      content: props.post.content,
      cover: props.post.cover,
      type: props.post.type,
      fileType: props.post.fileType,
      top: props.post.top,
      dependencies: Array.isArray(props.post.dependencies)
        ? props.post.dependencies.map((d) => d.id)
        : [],
    }
    postContent.value = props.post.content
    title.value = props.post.title

    enablePostRelation.value = props.post.type === 2
    selectedPosts.value = props.post.dependencies.map((d) => ({
      id: d.id,
      title: d.title,
      creator: {
        id: d.creator.id,
        nickname: d.creator.nickname,
      },
    }))
  } else {
    postContent.value = ''
  }

  plateList.value = Array.from(
    new Map(
      Object.values(postStore.plate)
        .flat()
        .map((item) => [item.id, item])
    ).values()
  )

  plateApi.getPlateList().then((res: Api) => {
    const data = res.data
    if (data.code == 200) {
      plateList.value = data.data as Plate[]
    }
  })

  versionApi.getVersion().then((res: Api) => {
    const data = res.data
    if (data.code == 200) {
      versionList.value = data.data.filter((v: any) => v.type === 'online')
    }
  })

  document.addEventListener('deviceready', () => {
    document.addEventListener(
      'backbutton',
      (e) => {
        e.preventDefault()
        onTipTap()
      },
      false
    )
  })
})

watch(
  () => relatedSearch.value,
  (newVal) => {
    console.log('relatedSearch', newVal)

    if (newVal) {
      postApi.searchPost(newVal).then((res: Api) => {
        const data = res.data
        if (data.code === 200) {
          filteredPosts.value = data.data.list.map((post: Post) => ({
            id: post.id,
            title: post.title,
            creator: post.creator,
          }))
        }
      })
    } else {
      filteredPosts.value = selectedPosts.value
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.tooltip-right::before {
  max-width: 15rem;
  text-align: left;
}
</style>
