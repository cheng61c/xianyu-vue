<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <Dropdown
        v-model="searchTypeValue"
        :options="searchTypeoptions"
        placeholder="搜索 标题和内容"
        class="w-40" />
      <ScInput v-model="searchPostValue" placeholder="搜索" class="w-xs" />
      <ScButton class="px-4" Border @click="search"> 搜索 </ScButton>
      <ScButton class="px-4" Border @click="getPosts"> 刷新 </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>板块:</span>
        <Dropdown
          v-model="plateBar"
          :options="plateBarOptions"
          placeholder="全部板块"
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

      <label class="flex items-center gap-2 w-full">
        <span>是否置顶:</span>
        <Dropdown
          v-model="isTop"
          :options="isTopOptions"
          placeholder="未置顶"
          class="flex-1" />
      </label>

      <label class="flex items-center gap-2 w-full">
        <span>排序方式:</span>
        <Dropdown
          v-model="orderBy"
          :options="orderByOptions"
          placeholder="类型"
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
            <th>板块</th>
            <th>用户</th>
            <th>发布时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in postList" :key="post.id">
            <th>{{ post.id }}</th>
            <td>{{ post.title }}</td>
            <td>{{ post.plate.name }}</td>
            <td>
              <div class="flex items-center gap-2">
                {{ post.creator.nickname }}
                <ScTag size="xs">uid: {{ post.creator.id }}</ScTag>
              </div>
            </td>
            <td>{{ post.createdAt }}</td>
            <td>
              <div class="flex items-center gap-2 flex-wrap">
                <ScTag v-if="post.status == 2" size="xs" status="error">
                  封禁
                </ScTag>
                <ScTag v-else size="xs" status="success"> 正常 </ScTag>

                <ScTag v-if="post.visible == 0" size="xs" status="error">
                  已下架
                </ScTag>

                <ScTag v-if="post.top == 1" size="xs" status="warning">
                  置顶中
                </ScTag>

                <ScTag v-if="post.disabled == 1" size="xs" status="error">
                  已删除
                </ScTag>
                <ScTag v-if="post.remark" size="xs" status="warning">
                  已备注
                </ScTag>
              </div>
            </td>

            <td>
              <div class="flex items-center gap-2">
                <ScButton
                  @click="setTop(index)"
                  class="border border-warning text-warning">
                  {{ post.top == 0 ? '置顶' : '取消置顶' }}
                </ScButton>

                <ScButton
                  @click="removed(index)"
                  :class="{
                    'border border-primary text-primary': post.visible == 1,
                    'border border-error text-error': post.visible == 0,
                  }">
                  {{ post.visible == 0 ? '已下架' : '上架中' }}
                </ScButton>

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
      <div>资源备注</div>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX } from 'lucide-vue-next'
import Dropdown from '@/components/ScSelector.vue'
import Card from '@/components/Card.vue'
import ScInput from '@/components/ScInput.vue'
import ScButton from '@/components/ScButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { plateApi, postApi } from '@/apis'
import Pagination from '@/components/Pagination.vue'
import type { Post, PostQueryDto } from '@/types/Post'
import ScTag from '@/components/ScTag.vue'
import { formatTime } from '@/hook/format'
import ScModal from '@/components/ScModal.vue'

const searchPostValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 帖子状态
const searchStatusOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '正常' },
  { value: 2, label: '禁用' },
  { value: 3, label: '已审核' },
]

const searchTypeValue = ref<number | { value: number; label: string }>(1) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: '搜索 标题和内容' },
  { value: 1, label: '搜索 标题' },
  { value: 2, label: '搜索 内容' },
  { value: 3, label: '搜索 用户ID' },
  { value: 4, label: '搜索 帖子ID' },
]

const orderBy = ref<number | { value: number; label: string }>(4) // 排序方式
const orderByOptions = [
  { value: 1, label: '按点赞降序' },
  { value: 2, label: '按观看数降序' },
  { value: 3, label: '按热度降序' },
  { value: 4, label: '按发布时间降序' },
]

const isTop = ref<number | { value: number; label: string }>(2) // 是否置顶
const isTopOptions = ref([
  { value: 0, label: '未置顶' },
  { value: 1, label: '已置顶' },
  { value: 2, label: '全部' },
])

const plateBar = ref<number | { value: number; label: string }>(0) // 板块ID，0为全部板块
const plateBarOptions = ref([{ value: 0, label: '全部板块' }]) // 板块下拉选项

const timeRange = ref({
  startTime: '',
  endTime: '',
}) // 时间范围选择

const postPage = ref({
  page: 1,
  total: 0,
  limit: 3,
})

const postList = ref<Post[]>([]) // 帖子列表数据
const bannedModal = ref(false) // 封禁帖子模态框状态
const currentPost = ref(-1) // 当前操作的帖子ID
const currentPostRemark = ref('') // 当前操作的帖子备注内容

const toPage = (page: number) => {
  postPage.value.page = page
  getPosts()
}

const search = () => {
  postPage.value.page = 1 // 重置页码
  getPosts() // 重新获取帖子列表
}

const getPosts = () => {
  const params: PostQueryDto = {}
  const isTopValue =
    typeof isTop.value === 'object' ? isTop.value.value : isTop.value
  const searchStatusValue =
    typeof searchStatus.value === 'object'
      ? searchStatus.value.value
      : searchStatus.value
  const plateBarValue =
    typeof plateBar.value === 'object' ? plateBar.value.value : plateBar.value
  const orderByValue =
    typeof orderBy.value === 'object' ? orderBy.value.value : orderBy.value
  const searchTypeVal =
    typeof searchTypeValue.value === 'object'
      ? searchTypeValue.value.value
      : searchTypeValue.value

  params.type = 2 // 帖子类型，2为资源帖
  params.page = postPage.value.page // 当前页码
  params.limit = postPage.value.limit // 每页数量
  params.orderType = orderByValue // 排序方式

  if (isTopValue !== 2) {
    const topValue = isTopValue

    params.top = topValue // 是否置顶
  }
  if (searchStatusValue !== 0) {
    params.status = searchStatusValue // 帖子状态
  }
  if (plateBarValue !== 0) {
    params.plateId = plateBarValue // 板块ID
  }

  if (timeRange.value.startTime && timeRange.value.endTime) {
    params.startTime = timeRange.value.startTime
    params.endTime = timeRange.value.endTime
  }

  if (searchPostValue.value) {
    let key = searchPostValue.value.trim()
    switch (searchTypeVal) {
      case 0:
        params.title = key
        params.content = key
        break

      case 1:
        params.title = key
        break

      case 2:
        params.content = key
        break

      case 3:
        params.creatorId = key
        break

      case 4:
        params.id = key
        break
    }
  }

  postApi
    .postListAsAdmin(params)
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
        postPage.value.limit = res.data.data.limit || 3
        postPage.value.page = res.data.data.page || 1
        postPage.value.total = res.data.data.total || 0
      }
    })
    .catch((error) => {
      console.error('请求错误:', error.msg)
    })
}

const getPlateList = () => {
  // 获取板块列表
  plateApi
    .getPlateList()
    .then((response) => {
      if (response.data.code === 200) {
        plateBarOptions.value = [
          { value: 0, label: '全部板块' },
          ...response.data.data
            .filter((plate: any) => plate.type === 2)
            .map((plate: any) => ({
              value: plate.id,
              label: plate.name,
            })),
        ]
      }
    })
    .catch((error) => {
      console.error('获取板块列表失败:', error.msg)
    })
}

const removed = (index: number) => {
  const item = postList.value[index]
  postApi
    .updatePostAsAdmin({
      id: item.id,
      visible: item.visible === 1 ? 0 : 1, // 切换可见状态
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

const setTop = (index: number) => {
  const item = postList.value[index]
  postApi
    .postToTopAsAdmin({
      id: item.id,
      top: item.top === 1 ? 0 : 1, // 切换置顶状态
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

const banned = (index: number, val?: number) => {
  const item = postList.value[index]
  if (!bannedModal.value) {
    currentPost.value = index // 设置当前操作的帖子
    currentPostRemark.value = item.remark || '' // 设置当前帖子备注内容
    bannedModal.value = true
    return
  }
  postApi
    .updatePostAsAdmin({
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

const deleteItem = (index: number) => {
  const item = postList.value[index]
  const isDeleted = item.disabled === 1 // 当前是否已删除
  postApi
    .deletePostAsAdmin({
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
  getPlateList() // 页面加载时获取板块列表
})
</script>
