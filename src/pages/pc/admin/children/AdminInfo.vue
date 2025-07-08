<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        placeholder="搜索 操作者ID"
        class="w-40" />
      <ScInput v-model="searchReportValue" placeholder="搜索" class="w-xs" />
      <ScButton class="px-4" Border @click="search"> 搜索 </ScButton>
      <ScButton class="px-4" Border @click="getPosts"> 刷新 </ScButton>
    </div>
  </Card>

  <Card class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>操作人</th>
            <th>目标地址</th>
            <th>传参</th>
            <th>操作IP</th>
            <th>操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="info in reportList" :key="info.id">
            <th>{{ info.id }}</th>
            <td>
              <div class="flex items-center gap-2 flex-wrap">
                {{ info.creator.nickname }}
                <ScTag size="xs">uid: {{ info.creator.id }}</ScTag>
                <template v-if="info.creator.roles">
                  <ScTag
                    size="xs"
                    v-for="role in info.creator.roles"
                    :key="role.id"
                    :bgColor="role.color">
                    {{ role.name }}
                  </ScTag>
                </template>
              </div>
            </td>
            <td>{{ info.path }}</td>
            <td>{{ info.params }}</td>
            <td>{{ info.ip }}</td>

            <td>{{ info.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <Pagination
    v-if="reportList.length"
    :current-page="reportPage.page"
    :total-items="reportPage.total"
    :page-size="reportPage.limit"
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

  <!-- <ScModal v-model="infoModal">
    <Card class="p-6 w-2xl max-h-[80vh] overflow-y-auto">
      <div class="text-xl mb-4"></div>

      <div class="flex items-center gap-2">
        <span class="text-gray-content">举报目标ID:</span>
        <span
          class="text-active link"
          @click="
            $router.push({
              name: 'postDetails',
              params: { postId: reportList[currentReport].targetId },
            })
          ">
          {{ reportList[currentReport].targetId }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">举报目标类型:</span>
        <span class="text-gray-content">
          {{ reportTypeBarMap[reportList[currentReport].targetType] }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">举报者ID:</span>
        <div class="flex items-center gap-2 flex-wrap">
          {{ reportList[currentReport].creator.nickname }}
          <ScTag size="xs">
            uid: {{ reportList[currentReport].creator.id }}
          </ScTag>
          <ScTag
            size="xs"
            v-if="reportList[currentReport].creator.roles"
            :bgColor="reportList[currentReport].creator.roles.color">
            {{ reportList[currentReport].creator.roles.name }}
          </ScTag>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">处理人ID:</span>
        <div class="flex items-center gap-2 flex-wrap">
          {{ reportList[currentReport].handler.nickname }}
          <ScTag size="xs"
            >uid: {{ reportList[currentReport].handler.id }}</ScTag
          >
          <ScTag
            size="xs"
            v-if="reportList[currentReport].handler.roles"
            :bgColor="reportList[currentReport].handler.roles.color">
            {{ reportList[currentReport].handler.roles.name }}
          </ScTag>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">举报理由:</span>
        <div class="text-gray-content">
          {{ reportList[currentReport].reason }}
        </div>
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="reportInfoModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX } from 'lucide-vue-next'
import Dropdown from '@/components/common/ScSelector.vue'
import Card from '@/components/common/Card.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { infoApi } from '@/apis'
import Pagination from '@/components/common/Pagination.vue'
import ScTag from '@/components/common/ScTag.vue'
import { formatTime } from '@/utils/format'
import type { InfoType, QueryInfoDto } from '@/types/Info'

const searchReportValue = ref('') // 搜索帖子内容

const searchType = ref<number | { value: number; label: string }>(0) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: '搜索 操作者ID' },
  { value: 1, label: '搜索 操作IP' },
]

const reportPage = ref({
  page: 1,
  total: 0,
  limit: 15,
})

const reportList = ref<InfoType[]>([])

const toPage = (page: number) => {
  reportPage.value.page = page
  getPosts()
}

const search = () => {
  reportPage.value.page = 1 // 重置页码
  getPosts() // 重新获取帖子列表
}

const getPosts = () => {
  const params: QueryInfoDto = {}
  params.page = reportPage.value.page // 当前页码
  params.limit = reportPage.value.limit // 每页数量

  const searchValue = searchReportValue.value.trim()

  const searchTypeValue =
    typeof searchType.value === 'object'
      ? searchType.value.value
      : searchType.value

  if (searchValue) {
    if (searchTypeValue === 0) {
      params.operator = +searchValue // 搜索操作者ID
    } else if (searchTypeValue === 1) {
      params.ip = searchValue // 搜索操作者IP
    }
  }

  infoApi
    .getInfo(params)
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        reportList.value = res.data.data.list.map((item: InfoType) => {
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          return item
        })
        reportPage.value.limit = res.data.data.limit || 15
        reportPage.value.page = res.data.data.page || 1
        reportPage.value.total = res.data.data.total || 0
      }
    })
    .catch((error) => {
      console.error('请求错误:', error.msg)
    })
}

onMounted(() => {
  getPosts() // 页面加载时获取帖子列表
})
</script>
