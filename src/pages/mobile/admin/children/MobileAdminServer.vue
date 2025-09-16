<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <ScInput
        v-model="searchPostValue"
        :placeholder="$t('b.sou-suo')"
        class="w-full" />
    </div>
    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        :placeholder="$t('b.sou-suo-biao-ti-he-nei-rong')"
        class="w-52" />
      <ScButton class="px-4" Border @click="search">
        {{ $t('b.sou-suo') }}
      </ScButton>
      <ScButton class="px-4" Border @click="getPosts">
        {{ $t('b.shua-xin') }}
      </ScButton>
    </div>
    <div class="flex gap-4 flex-wrap">
      <label class="flex items-center gap-2 w-full">
        <span>服务器类型</span>
        <Dropdown
          v-model="levelBar"
          :options="levelBarOptions"
          :placeholder="$t('b.quan-bu')"
          class="flex-1" />
      </label>

      <label class="flex items-center gap-2 w-full">
        <span>{{ $t('b.zhuang-tai') }}</span>
        <Dropdown
          v-model="searchStatus"
          :options="searchStatusOptions"
          :placeholder="$t('b.quan-bu')"
          class="flex-1" />
      </label>
    </div>
  </Card>

  <Card class="mb-4">
    <ScReusableTable :thead="thead" :tbody="postList" v-model:lockId="lockId">
      <template #cell-0="{ data }">
        <span class="font-bold">{{ data.id }}</span>
      </template>
      <template #cell-1="{ data }">
        {{ data.title }}
      </template>

      <template #cell-2="{ data }">
        {{ data.version.name }} / {{ data.version.version }}
      </template>
      <template #cell-3="{ data }">
        <div class="flex items-center gap-2 flex-wrap w-22">
          {{ data.creator.nickname }}
          <ScRole size="xs" :user="data.creator">
            uid: {{ data.creator.id }}
          </ScRole>
        </div>
      </template>
      <template #cell-4="{ data }">
        {{ levelBarMap[data.level] }}
      </template>
      <template #cell-5="{ data }">
        {{ data.url }}
      </template>
      <template #cell-6="{ data }">
        {{ data.createdAt }}
      </template>
      <template #cell-7="{ data }">
        <div class="flex items-center gap-2 flex-wrap">
          <ScTag v-if="data.status == 2" size="xs" status="error">
            {{ $t('b.feng-jin') }}
          </ScTag>
          <ScTag v-if="data.disabled == 1" size="xs" status="error">
            {{ $t('b.yi-shan-chu') }}
          </ScTag>
          <ScTag v-else size="xs" status="success">
            {{ $t('b.zheng-chang') }}
          </ScTag>
          <ScTag v-if="data.remark" size="xs" status="warning">
            {{ $t('b.yi-bei-zhu') }}
          </ScTag>
        </div>
      </template>
      <template #cell-8="{ data, index }">
        <div class="flex items-center gap-2 flex-wrap">
          <ScButton
            @click="banned(index)"
            :Border="data.status == 1 || data.status == 3"
            :class="{
              'border border-error text-error': data.status == 2,
            }">
            {{ data.status == 2 ? '撤销封禁' : '封禁' }}
          </ScButton>

          <ScButton
            @click="deleteItem(index)"
            :class="{
              'border border-green text-green': data.disabled == 1,
              'border border-error text-error': data.disabled == 0,
            }">
            {{ data.disabled == 0 ? $t('b.shan-chu') : '恢复' }}
          </ScButton>

          <ScButton @click="updatePost(index)" Border>
            {{ $t('b.xiu-gai-ji-bie') }}
          </ScButton>
        </div>
      </template>
    </ScReusableTable>
  </Card>

  <Pagination
    v-if="postList.length"
    :current-page="postPage.page"
    :total-items="postPage.total"
    :page-size="postPage.limit"
    @page-change="toPage" />

  <EmptyState
    v-else
    :title="$t('t.zan-wu-tie-zi')"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    :action="$t('b.dian-ji-shua-xin')"
    :actionIcon="RotateCcw"
    @action-click="toPage" />

  <ScModal v-model="bannedModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('d.zi-yuan-bei-zhu') }}</div>
      <ScInput
        v-model="currentPostRemark"
        :placeholder="$t('d.shi-mo-ye-mei-you')"
        multiline
        :rows="12"
        :resizable="false"
        class="mt-2 mb-4 h-[20rem]" />
      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="banned(currentPost, 2)">
          {{ $t('b.feng-jin') }}
        </ScButton>
        <ScButton class="px-4" @click="banned(currentPost, 3)" Border>
          {{ $t('d.che-xiao-feng-jin') }}
        </ScButton>
        <ScButton class="px-4" @click="bannedModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="updateModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('d.xiu-gai-fu-wu-qi-ji-bie') }}</div>
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
          {{ $t('b.que-ren-xiu-gai') }}
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          {{ $t('b.qu-xiao') }}
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
import { formatTime } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'
import type { ServerPostListQueryDto, ServerPostType } from '@/types/ServerPost'
import { useI18n } from 'vue-i18n'
import ScRole from '@/components/common/ScRole.vue'
import ScReusableTable from '@/components/common/ScReusableTable.vue'
const { t } = useI18n()

const thead = ref([
  'ID',
  '标题',
  '版本',
  '用户',
  '类型',
  '服务器地址',
  '发布时间',
  '状态',
  '操作',
])
const lockId = ref(-1)

const searchPostValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 帖子状态
const searchStatusOptions = [
  { value: 0, label: t('b.quan-bu') },
  { value: 1, label: t('b.zheng-chang') },
  { value: 2, label: t('b.jin-yong') },
  { value: 3, label: t('b.yi-shen-he') },
]

const searchType = ref<number | { value: number; label: string }>(1) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: t('b.sou-suo-biao-ti-he-nei-rong') },
  { value: 1, label: t('b.sou-suo-fu-wu-qi-ip') },
]

const levelBar = ref<number | { value: number; label: string }>(0) // 服务器等级
const levelBarOptions = [
  { value: 0, label: t('b.ge-ren-fu') },
  { value: 1, label: t('b.she-qu-fu') },
]
const levelBarMap: { [key: number]: string } = {
  0: t('b.ge-ren-fu'),
  1: t('b.she-qu-fu'),
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
