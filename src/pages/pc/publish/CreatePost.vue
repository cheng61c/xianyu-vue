<template>
  <div class="flex flex-col w-full space-y-4 pb-2">
    <div class="flex gap-2 items-center">
      <ScButton
        class="px-4 py-1 text-sm border border-gray"
        @click="$router.back()">
        {{ $t('b.fan-hui') }}
      </ScButton>
      <div class="text-lg font-semibold">
        {{ isEdit ? $t('b.bian-ji-tie-zi') : $t('b.fa-bu-tie-zi') }}
      </div>
      <div v-if="!userStore.isLogin" class="text-error">
        {{ $t('d.qing-xian-deng-lu-hou-zai-fa-bu-tie-zi') }}
      </div>
    </div>

    <!-- 表单部分 -->
    <div class="space-y-4 text-sm">
      <!-- 标题 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              't.tie-zi-biao-ti-tie-zi-biao-ti-hui-xian-shi-zai-you-xi-nei-she-qu-de-lie-biao-zhong-jian-yi-shi-yong-jian-duan-de-biao-ti-bian-yu-yong-hu-kuai-su-sou-suo'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('b.biao-ti') }} <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <input
          v-model="title"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          :placeholder="$t('d.qing-shu-ru-biao-ti')" />
      </div>

      <!-- 模式选择 -->
      <div class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              't.mo-shi-xuan-ze-yong-yu-xuan-ze-fa-bu-tie-zi-huo-fu-wu-qi-bu-tong-mo-shi-xia-de-biao-dan-nei-rong-hui-you-suo-bu-tong'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('f.mo-shi-xuan-ze') }} <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <div class="flex gap-2">
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="mode === 'post'"
            Border
            @click="mode = 'post'">
            {{ $t('nav.tie-zi') }}
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="mode === 'resources'"
            Border
            @click="mode = 'resources'">
            资源
          </ScButton>
          <ScButton
            v-if="verifyPermissions([1, 2, 8, 9])"
            class="px-4 py-1 text-sm"
            :activation="mode === 'server'"
            Border
            @click="mode = 'server'">
            {{ $t('nav.fu-wu-qi') }}
          </ScButton>
        </div>
      </div>

      <!-- 置顶模式 -->
      <div
        v-if="
          (verifyPermissions([1, 2, 6, 9]) && mode === 'post') ||
          (verifyPermissions([1, 2, 6, 9]) && mode === 'resources')
        "
        class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              'f.zhi-ding-xuan-xiang-yong-yu-xuan-ze-tie-zi-zai-she-qu-zhong-de-xian-shi-fang-shi-zhi-ding-de-tie-zi-hui-zai-lie-biao-zhong-you-xian-xian-shi-heng-fu-gong-gao-he-dan-chuang-gong-gao-hui-zai-zhan-nei-you-te-shu-ti-shi'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('b.zhi-ding-mo-shi') }} <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <div class="flex gap-2">
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 0"
            Border
            @click="postData.top = 0">
            {{ $t('b.bu-zhi-ding') }}
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 1"
            Border
            @click="postData.top = 1">
            {{ $t('b.zhi-ding') }}
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 2"
            Border
            @click="postData.top = 2">
            {{ $t('b.heng-fu-gong-gao') }}
          </ScButton>
          <ScButton
            class="px-4 py-1 text-sm"
            :activation="postData.top === 3"
            Border
            @click="postData.top = 3">
            {{ $t('b.dan-chuang-gong-gao') }}
          </ScButton>
          <span
            v-if="postData.top == 2"
            class="flex gap-1 text-green items-center">
            <CircleAlert :size="16" />
            {{
              $t(
                'd.shi-yong-heng-fu-gong-gao-xuan-xiang-shi-gai-tie-zi-de-biao-ti-jiang-zhi-ding-zai-zhu-ye-de-ye-mian-ding-duan'
              )
            }}
          </span>
          <span
            v-if="postData.top == 3"
            class="flex gap-1 text-green items-center">
            <CircleAlert :size="16" />
            {{
              $t(
                'd.shi-yong-dan-chuang-gong-gao-xuan-xiang-shi-gai-tie-zi-jiang-zai-ye-mian-jia-zai-wan-cheng-shi-dan-chu'
              )
            }}
          </span>
        </div>
      </div>

      <!-- 发送到板块 -->
      <div
        v-if="mode === 'post' || mode === 'resources'"
        class="flex flex-wrap items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              'd.xuan-ze-yao-fa-song-dao-de-ban-kuai-ban-kuai-lei-xing-hui-ying-xiang-tie-zi-lei-xing-de-xuan-ze-wen-jian-lei-xing-de-tie-zi-zhi-neng-fa-song-dao-wen-jian-ban-kuai'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('f.xuan-ze-ban-kuai') }}
            <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>

        <div v-if="mode === 'post'" class="flex flex-wrap gap-2 w-full pl-2">
          <label
            class="w-24 flex justify-between items-center tooltip tooltip-right">
            <span class="flex items-center gap-1">
              {{ $t('f.jiao-liu-ban-kuai') }}
            </span>
          </label>
          <template v-for="b in plateList" :key="`post-${b.id}`">
            <ScButton
              v-if="b.type === 1"
              class="px-4 py-1 text-sm"
              :activation="postData.plateId === b.id"
              @click="setPlate(b)"
              :icon="FileText"
              Border
              :disabled="b.admin && !verifyPermissions([1, 2, 9])">
              {{ b.name }}
            </ScButton>
          </template>
        </div>

        <div
          v-if="mode === 'resources'"
          class="flex flex-wrap gap-2 w-full pl-2">
          <label
            class="w-24 flex justify-between items-center tooltip tooltip-right">
            <span class="flex items-center gap-1">
              {{ $t('f.zi-yuan-ban-kuai') }}
            </span>
          </label>
          <template v-for="b in plateList" :key="`res-${b.id}`">
            <ScButton
              v-if="b.type === 2"
              class="px-4 py-1 text-sm"
              :activation="postData.plateId === b.id"
              @click="setPlate(b)"
              :icon="Package"
              Border
              :disabled="b.admin && !verifyPermissions([1, 2, 9])">
              {{ b.name }}
            </ScButton>
          </template>
        </div>
      </div>

      <!-- 文件类型 -->
      <div
        v-if="postData.type === 2 && mode === 'resources'"
        class="flex items-center gap-2 flex-wrap">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              'd.xuan-ze-wen-jian-lei-xing-wen-jian-lei-xing-hui-ying-xiang-wen-jian-de-shang-chuan-fang-shi-he-xian-shi-fang-shi-qie-yi-ge-tie-zi-zhong-zhi-neng-cun-zai-yi-zhong-wen-jian-lei-xing-jian-yi-gen-ju-shi-ji-qing-kuang-xuan-ze-he-shi-de-wen-jian-lei-xing'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('f.wen-jian-lei-xing') }}
            <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <div class="flex gap-2 flex-wrap">
          <ScButton
            v-for="type in fileTypes"
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
          {{
            $t(
              'd.shi-yong-qi-ta-xuan-xiang-shi-shang-chuan-de-zi-yuan-jiang-bu-hui-zai-you-xi-zhong-xian-shi'
            )
          }}
        </span>
      </div>
      <!-- 是否关联帖子开关 -->
      <div
        v-if="postData.type === 2 && mode === 'resources'"
        class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              'd.guan-lian-tie-zi-dang-gai-tie-zi-suo-shi-yong-de-wen-jian-xu-yao-yi-lai-qi-ta-tie-zi-zhong-de-wen-jian-shi-shi-yong-qi-yong-hou-ke-yi-xuan-ze-qi-ta-tie-zi-jin-hang-guan-lian-bian-yu-kuai-su-cha-zhao-he-shi-yong'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('f.guan-lian-tie-zi') }}
            <span><CircleHelp :size="16" /></span>
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
          <span class="text-sm text-background-content">{{
            $t('f.qi-yong-guan-lian-tie-zi-xuan-ze')
          }}</span>
        </label>
      </div>

      <!-- 穿梭框选择器 -->
      <div
        v-if="postData.type === 2 && mode === 'resources' && enablePostRelation"
        class="flex items-start gap-2">
        <label class="w-24 text-right mt-2"></label>
        <div class="flex gap-6 w-full max-w-3xl">
          <!-- 左侧搜索与结果 -->
          <div class="flex-1">
            <input
              v-model="relatedSearch"
              type="text"
              :placeholder="$t('t.sou-suo-tie-zi-biao-ti')"
              class="w-full mb-2 px-3 py-1.5 border border-gray-content rounded-lg text-sm focus:ring-2 focus:ring-active outline-none" />
            <div
              class="border border-gray-content rounded-lg p-2 h-[180px] overflow-y-auto space-y-1 text-sm">
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="px-2 py-1 cursor-pointer rounded hover:bg-blue-100 transition"
                @click="addPost(post)">
                {{ post.title }}({{ post.creator.nickname }})
              </div>
              <div
                v-if="filteredPosts.length === 0"
                class="text-gray-400 text-center py-2">
                {{ $t('d.mei-you-pi-pei-de-tie-zi') }}
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
                <span>{{ post.title }}({{ post.creator.nickname }})</span>
                <button
                  class="text-red-500 hover:underline text-xs"
                  @click="removePost(post.id)">
                  {{ $t('b.yi-chu') }}
                </button>
              </div>
              <div
                v-if="selectedPosts.length === 0"
                class="text-gray-400 text-center py-2">
                {{ $t('d.zan-wu-yi-xuan-tie-zi') }}
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
            {{ $t('f.fu-wu-qi-ip') }} <span><CircleHelp :size="16" /></span>
          </span>

          <span>:</span>
        </label>
        <input
          v-model="serverData.url"
          type="text"
          class="w-full max-w-md px-4 py-2 border border-gray-content rounded-lg focus:outline-none focus:ring-2 focus:ring-active"
          :placeholder="$t('d.qing-shu-ru-fu-wu-qi-ip')"
          @blur="connectionTest(serverData.url)" />

        <span
          class="text-info tooltip tooltip-right"
          :data-tip="
            $t(
              't.gai-ce-shi-zhi-dui-ip-you-xiao-yu-duan-kou-hao-wu-guan-qing-que-bao-duan-kou-hao-yi-kai-fang'
            )
          "
          v-if="pingLoding">
          {{ $t('d.ce-shi-yan-chi-zhong') }}
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
        v-if="mode === 'server' && pingAvgTime == -1 && !pingLoding"
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
            {{
              $t(
                'd.jian-ce-dao-ip-wu-fa-ping-tong-ruo-yi-que-ding-ip-zheng-chang-qing-gou-xuan'
              )
            }}
          </span>
        </label>
      </div>
      <!-- 服务器版本 -->
      <div v-if="mode === 'server'" class="flex items-center gap-2">
        <label
          class="w-24 flex justify-between items-center tooltip tooltip-right"
          :data-tip="
            $t(
              'd.xuan-ze-fu-wu-qi-ban-ben-fu-wu-qi-ban-ben-hui-ying-xiang-you-xi-nei-de-lian-jie-fang-shi-he-gong-neng-jian-yi-gen-ju-shi-ji-qing-kuang-xuan-ze-he-shi-de-ban-ben'
            )
          ">
          <span class="flex items-center gap-1">
            {{ $t('f.fu-wu-qi-ban-ben') }}
            <span><CircleHelp :size="16" /></span>
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
    </div>

    <!-- 编辑器 -->
    <div v-if="postContent !== null">
      <TipTap v-model="postContent" />
    </div>

    <!-- 发布按钮 -->
    <div class="flex justify-end my-2">
      <ScButton
        activation
        :disabled="userStore.isLogin === false || loader"
        class="px-6 py-2 hover:bg-active/80"
        @click="submitPost"
        :loading="loader">
        {{ isEdit ? $t('b.geng-xin-tie-zi') : $t('b.fa-bu-tie-zi') }}
      </ScButton>
    </div>
  </div>
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
} from 'lucide-vue-next'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import type { Post, SelectedPost } from '@/types/Post'
import type PostDto from '@/types/PostDto'
import { useToast } from 'vue-toastification'
import { usePostStore } from '@/stores/module/post/postStore'
import type { Plate } from '@/types/Plate'
import ScButton from '@/components/common/ScButton.vue'
import { postApi, pingApi, plateApi, versionApi, serverApi } from '@/apis'
import type { Version } from '@/types/version'
import { verifyPermissions } from '@/utils/verify'
import { useUserStore } from '@/stores/module/user/userStore'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getfileTypes } from '@/stores/module/post/service'

const { t } = useI18n()
const toast = useToast()
const postStore = usePostStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const fileTypes = getfileTypes(t)
const isEdit = ref(false)
const plateList = ref<Plate[]>([]) // 板块列表
const versionList = ref<Version[]>([]) // 版本列表

// 表单
const postContent = ref<string | null>(null) // 帖子内容
const title = ref('') // 标题
const mode = ref<'post' | 'server' | 'resources'>('post') // 模式选择
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
    toast.error(t('t.biao-ti-bu-neng-wei-kong'))
    return
  }
  if (postContent.value && !postContent.value.trim()) {
    toast.error(t('t.nei-rong-bu-neng-wei-kong'))
    return
  }

  if (mode.value === 'post' || mode.value === 'resources') {
    if (
      postData.value.plateId === 0 ||
      (mode.value === 'resources' && postData.value.type !== 2)
    ) {
      toast.error(t('t.qing-xuan-ze-ban-kuai'))
      return
    }
    if (postData.value.type === 2 && postData.value.fileType === 0) {
      toast.error(t('t.qing-xuan-ze-wen-jian-lei-xing'))
      return
    }
    sendPsot()
  } else {
    if (!serverData.value.url.trim()) {
      toast.error(t('t.fu-wu-qi-di-zhi-bu-neng-wei-kong'))
      return
    }

    if (serverData.value.versionId === 0) {
      toast.error(t('t.qing-xuan-ze-fu-wu-qi-ban-ben'))
      return
    }
    sendServer()
  }
}

const sendPsot = () => {
  if (postContent.value === null) {
    toast.error(t('t.nei-rong-bu-neng-wei-kong'))
    return
  }
  postData.value.title = title.value
  postData.value.content = postContent.value
  postData.value.dependencies = selectedPosts.value.map((p) => p.id)

  loader.value = true

  console.log('postData', postData.value)

  postApi[isEdit.value ? 'updatePost' : 'createPost'](
    formatPostBody(postData.value)
  )
    .then((res: Api) => {
      if (res.data.code === 200) {
        loader.value = false
        if (postData.value.type == 2) {
          toast.success('请继续发布文件')
          router.push({
            name: 'publishResource',
            params: { postId: res.data.data.id ?? postData.value.id },
          })
        } else {
          toast.success(t('t.fa-bu-cheng-gong'))
          router.back()
        }
      }
    })
    .catch((err) => {
      toast.error(t('t.fa-bu-shi-bai') + err.msg)
      loader.value = false
    })
}

const sendServer = () => {
  if (postContent.value === null) {
    toast.error(t('t.nei-rong-bu-neng-wei-kong'))
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
        toast.success(t('t.fa-bu-cheng-gong'))
        loader.value = false
        window.history.back()
      }
    })
    .catch((err) => {
      toast.error(t('t.fa-bu-shi-bai') + err.msg)
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
    toast.error(t('t.ben-di-di-zhi-huo-ju-yu-wang-ip-bu-zhi-chi'))
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
        toast.success(t('t.lian-jie-cheng-gong'))
      } else {
        toast.error(t('t.lian-jie-shi-bai-qing-jian-cha-fu-wu-qi-di-zhi'))
        data.avgTime = '-1'
      }
      pingAvgTime.value = Number(data.avgTime)
      pingAuccess.value = data.success
      pingLoding.value = false
    })
    .catch(() => {
      toast.error(t('t.lian-jie-shi-bai-qing-jian-cha-fu-wu-qi-di-zhi'))
      pingAvgTime.value = -1
      pingAuccess.value = false
      pingLoding.value = false
    })
}

const formatPostBody = (body: PostDto) => {
  if (body.id == 0 && !isEdit.value) delete body.id
  if (body.type == 1) {
    delete body.fileType
    delete body.dependencies
  }
  if (body.type == 2) {
    body.dependencies = selectedPosts.value.map((p) => p.id)
  } else {
    body.dependencies = []
  }
  console.log('body', body)

  return body
}

onMounted(async () => {
  if (route.params.postId) {
    const res = await postApi.getPostDetail(Number(route.params.postId))
    if (res.data.code == 200) {
      isEdit.value = true
      const post = res.data.data as Post
      postData.value = {
        id: post.id,
        title: post.title,
        plateId: post.plateId,
        content: post.content,
        cover: post.cover,
        type: post.type,
        fileType: post.fileType,
        top: post.top,
        dependencies: Array.isArray(post.dependencies)
          ? post.dependencies.map((d) => d.id)
          : [],
      }
      postContent.value = post.content
      title.value = post.title

      enablePostRelation.value = post.type === 2
      selectedPosts.value = post.dependencies.map((d) => ({
        id: d.id,
        title: d.title,
        creator: {
          id: d.creator.id,
          nickname: d.creator.nickname,
        },
      }))
    } else {
      isEdit.value = false
      postContent.value = ''
    }
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
