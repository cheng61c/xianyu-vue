<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        placeholder="搜索 标题和内容"
        class="w-40" />
      <ScInput v-model="searchPostValue" placeholder="搜索" class="w-xs" />
      <ScButton class="px-4" Border @click="search"> 搜索 </ScButton>
      <ScButton class="px-4" Border @click="getPosts"> 刷新 </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>服务器级别:</span>
        <Dropdown
          v-model="levelBar"
          :options="levelBarOptions"
          placeholder="全部"
          class="flex-1" />
      </label>

      <label class="flex items-center gap-2 w-full">
        <span>状态:</span>
        <Dropdown
          v-model="searchStatus"
          :options="searchStatusOptions"
          placeholder="全部"
          class="flex-1" />
      </label>
    </div>
  </Card>

  <Card class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>版本号</th>
            <th>用户</th>
            <th>级别</th>
            <th>服务器地址</th>
            <th>发布时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in postList" :key="post.id">
            <th>{{ post.id }}</th>
            <td>{{ post.title }}</td>
            <td>{{ post.version.name }} / {{ post.version.version }}</td>
            <td>
              <div class="flex items-center gap-2">
                {{ post.creator.nickname }}
                <ScTag size="xs">uid: {{ post.creator.id }}</ScTag>
              </div>
            </td>
            <td>{{ levelBarMap[post.level] }}</td>
            <td>{{ post.url }}</td>
            <td>{{ post.createdAt }}</td>
            <td>
              <div class="flex items-center gap-2 flex-wrap">
                <ScTag v-if="post.status == 2" size="xs" status="error">
                  封禁
                </ScTag>
                <ScTag v-if="post.disabled == 1" size="xs" status="error">
                  已删除
                </ScTag>
                <ScTag v-else size="xs" status="success"> 正常 </ScTag>
                <ScTag v-if="post.remark" size="xs" status="warning">
                  已备注
                </ScTag>
              </div>
            </td>

            <td>
              <div class="flex items-center gap-2">
                <ScButton
                  @click="banned(index)"
                  :Border="post.status == 1 || post.status == 3"
                  :class="{
                    'border border-error text-error': post.status == 2,
                  }">
                  {{ post.status == 2 ? '撤销封禁' : '封禁' }}
                </ScButton>

                <ScButton
                  @click="deleteItem(index)"
                  :class="{
                    'border border-green text-green': post.disabled == 1,
                    'border border-error text-error': post.disabled == 0,
                  }">
                  {{ post.disabled == 0 ? '删除' : '恢复' }}
                </ScButton>

                <ScButton @click="updatePost(index)" Border>
                  修改级别
                </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <Pagination
    v-if="postList.length"
    :current-page="postPage.page"
    :total-items="postPage.total"
    :page-size="postPage.limit"
    @page-change="toPage" />

  <EmptyState
    v-else
    title="暂无帖子"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    action="点击刷新"
    :actionIcon="RotateCcw"
    @action-click="toPage" />

  <ScModal v-model="bannedModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">资源备注</div>
      <ScInput
        v-model="currentPostRemark"
        placeholder="什么也没有"
        multiline
        :rows="12"
        :resizable="false"
        class="mt-2 mb-4 h-[20rem]" />
      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="banned(currentPost, 2)">
          封禁
        </ScButton>
        <ScButton class="px-4" @click="banned(currentPost, 3)" Border>
          撤销封禁
        </ScButton>
        <ScButton class="px-4" @click="bannedModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">修改服务器级别</div>
      <ScButton
        v-for="(option, index) in levelBarOptions"
        :key="index"
        class="px-4 mb-2"
        Border
        :activation="currentLevel === option.value"
        @click="currentLevel = option.value">
        {{ option.label }}
      </ScButton>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updatePost(currentPost)" Border>
          确认修改
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX } from 'lucide-vue-next'
import Dropdown from '@/components/common/ScSelector.vue'
import Card from '@/components/common/Card.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { serverApi } from '@/apis'
import Pagination from '@/components/common/Pagination.vue'
import type { Post } from '@/types/Post'
import ScTag from '@/components/common/ScTag.vue'
import { formatTime } from '@/hook/format'
import ScModal from '@/components/common/ScModal.vue'
import type { ServerPostListQueryDto, ServerPostType } from '@/types/ServerPost'

const searchPostValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 帖子状态
const searchStatusOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '正常' },
  { value: 2, label: '禁用' },
  { value: 3, label: '已审核' },
]

const searchType = ref<number | { value: number; label: string }>(1) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: '搜索 标题和内容' },
  { value: 1, label: '搜索 服务器IP' },
]

const levelBar = ref<number | { value: number; label: string }>(0) // 服务器等级
const levelBarOptions = [
  { value: 0, label: '个人服' },
  { value: 1, label: '社区服' },
]
const levelBarMap: { [key: number]: string } = {
  0: '个人服',
  1: '社区服',
} // 服务器等级映射
const currentLevel = ref(0) // 当前操作的服务器等级

// const timeRange = ref({
//   startTime: '',
//   endTime: '',
// }) // 时间范围选择

const postPage = ref({
  page: 1,
  total: 0,
  limit: 10,
})

const postList = ref<ServerPostType[]>([]) // 帖子列表数据
const bannedModal = ref(false) // 封禁帖子模态框状态
const currentPost = ref(-1) // 当前操作的帖子ID
const currentPostRemark = ref('') // 当前操作的帖子备注内容
const updateModal = ref(false) // 更新帖子模态框状态

const toPage = (page: number) => {
  postPage.value.page = page
  getPosts()
}

const search = () => {
  postPage.value.page = 1 // 重置页码
  getPosts() // 重新获取帖子列表
}

const getPosts = () => {
  const params: ServerPostListQueryDto = {}

  const searchStatusValue =
    typeof searchStatus.value === 'object'
      ? searchStatus.value.value
      : searchStatus.value
  const levelBarValue =
    typeof levelBar.value === 'object' ? levelBar.value.value : levelBar.value
  const searchTypeValue =
    typeof searchType.value === 'object'
      ? searchType.value.value
      : searchType.value

  params.page = postPage.value.page // 当前页码
  params.limit = postPage.value.limit // 每页数量

  if (levelBarValue !== 0) {
    params.level = levelBarValue // 服务器等级
  }
  if (searchStatusValue !== 0) {
    params.status = searchStatusValue // 帖子状态
  }
  if (searchPostValue.value) {
    if (searchTypeValue == 1) {
      params.url = searchPostValue.value.trim()
    } else {
      params.key = searchPostValue.value.trim()
    }
  }

  serverApi
    .getServerListAsAdmin(params)
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        postList.value = res.data.data.list.map((item: Post) => {
          item.createdAt = formatTime(item.createdAt)
          item.title =
            item.title.length > 20
              ? item.title.slice(0, 20) + '...'
              : item.title
          return item
        })
        postPage.value.limit = res.data.data.limit || 10
        postPage.value.page = res.data.data.page || 1
        postPage.value.total = res.data.data.total || 0
      }
    })
    .catch((error) => {
      console.error('请求错误:', error.msg)
    })
}

const banned = (index: number, val?: number) => {
  const item = postList.value[index]
  if (!bannedModal.value) {
    currentPost.value = index // 设置当前操作的帖子
    currentPostRemark.value = item.remark || '' // 设置当前帖子备注内容
    bannedModal.value = true
    return
  }
  serverApi
    .updateServerPostAsAdmin({
      id: item.id,
      status: val ?? (item.status === 1 || item.status === 3 ? 2 : 3), // 切换状态
      remark: currentPostRemark.value, // 更新备注内容
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        bannedModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const updatePost = (index: number) => {
  const item = postList.value[index]
  if (!updateModal.value) {
    // 打开更新帖子模态框
    updateModal.value = true
    currentPost.value = index // 设置当前操作的帖子
    return
  }
  serverApi
    .updateServerPostAsAdmin({
      id: item.id,
      level: currentLevel.value, // 更新服务器级别
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        updateModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const deleteItem = (index: number) => {
  const item = postList.value[index]
  const isDeleted = item.disabled === 1 // 是否已删除
  serverApi
    .deleteServerAsAdmin({
      id: item.id,
      disabled: isDeleted ? 0 : 1, // 切换删除状态
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

onMounted(() => {
  getPosts() // 页面加载时获取帖子列表
})
</script>
