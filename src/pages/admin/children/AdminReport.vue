<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        placeholder="搜索 举报者ID"
        class="w-40" />
      <ScInput v-model="searchReportValue" placeholder="搜索" class="w-xs" />
      <ScButton class="px-4" Border @click="search"> 搜索 </ScButton>
      <ScButton class="px-4" Border @click="getPosts"> 刷新 </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>举报类型:</span>
        <Dropdown
          v-model="reportTypeBar"
          :options="reportTypeOptions"
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
            <th>目标类型</th>
            <th>目标ID</th>
            <th>举报者</th>
            <th>处理人</th>
            <th>处理状态</th>
            <th>处理备注</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in reportList" :key="report.id">
            <th>{{ report.id }}</th>
            <td>{{ reportTypeBarMap[report.targetType] }}</td>
            <td>{{ report.targetId }}</td>
            <td>
              <div class="flex items-center gap-2 flex-wrap">
                {{ report.creator.nickname }}
                <ScTag size="xs">uid: {{ report.creator.id }}</ScTag>
              </div>
            </td>
            <td>
              <div class="flex items-center gap-2 flex-wrap">
                {{ report.handler.nickname }}
                <ScTag size="xs">uid: {{ report.handler.id }}</ScTag>
                <ScTag
                  size="xs"
                  v-if="report.handler.roles"
                  :bgColor="report.handler.roles.color">
                  {{ report.handler.roles.name }}
                </ScTag>
              </div>
            </td>
            <td>{{ searchStatusMap[report.status] }}</td>
            <td>{{ report.result }}</td>
            <td>{{ report.createdAt }}</td>
            <td>{{ report.updatedAt }}</td>
            <!-- <td>
              <div class="flex items-center gap-2 flex-wrap">
                <ScTag v-if="report.status == 2" size="xs" status="error">
                  封禁
                </ScTag>
                <ScTag v-else size="xs" status="success"> 正常 </ScTag>

                <ScTag v-if="report.result" size="xs" status="warning">
                  已备注
                </ScTag>
              </div>
            </td> -->

            <td>
              <div class="flex items-center gap-2 flex-wrap">
                <ScButton @click="reportInfo(index)" Border>
                  查看详情
                </ScButton>
                <ScButton @click="updateReport(index)" Border> 审核 </ScButton>
              </div>
            </td>
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

  <ScModal v-model="reportInfoModal">
    <Card class="p-6 w-2xl max-h-[80vh] overflow-y-auto">
      <div class="text-xl mb-4">举报详情</div>

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
  </ScModal>

  <ScModal v-model="reportUpdateModal">
    <Card class="p-6 w-2xl max-h-[80vh] overflow-y-auto">
      <div class="text-xl mb-4">审核</div>

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
        <span class="text-gray-content">举报理由:</span>
        <div class="text-gray-content">
          {{ reportList[currentReport].reason }}
        </div>
      </div>

      <div class="border border-gray/60 mb-4"></div>

      <div class="flex items-center gap-2">
        <span class="text-gray-content">设置状态:</span>
        <div class="flex items-center gap-2 flex-wrap">
          <Dropdown
            v-model="currentReportStatus"
            :options="searchStatusOptions"
            placeholder="全部"
            class="w-40" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">处理备注:</span>
      </div>
      <ScInput
        v-model="currentReportRemark"
        placeholder="请输入处理备注"
        multiline
        :rows="5"
        :resizable="false"
        class="mt-2 mb-4" />
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateReport(currentReport)" Border>
          提交
        </ScButton>
        <ScButton class="px-4" @click="reportUpdateModal = false" Border>
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
import { reportApi } from '@/apis'
import Pagination from '@/components/Pagination.vue'
import ScTag from '@/components/ScTag.vue'
import { formatTime } from '@/hook/format'
import ScModal from '@/components/ScModal.vue'
import type { ReportDto, ReportType } from '@/types/Report'

const searchReportValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 帖子状态
const currentReportStatus = ref<number | { value: number; label: string }>(0) // 当前操作的帖子状态
const searchStatusOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '未处理' },
  { value: 2, label: '封禁' },
  { value: 3, label: '审核通过' },
]
const searchStatusMap: { [key: number]: string } = {
  0: '全部',
  1: '未处理',
  2: '封禁',
  3: '审核通过',
}

const searchType = ref<number | { value: number; label: string }>(0) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: '搜索 举报者ID' },
  { value: 1, label: '搜索 举报目标ID' },
  { value: 2, label: '搜索 处理人ID' },
]

const reportTypeBar = ref<number | { value: number; label: string }>(0) // 服务器等级
const reportTypeOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '帖子' },
  { value: 2, label: '评论' },
  { value: 3, label: '服务器' },
  { value: 4, label: '用户' },
]
const reportTypeBarMap: { [key: number]: string } = {
  0: '全部',
  1: '帖子',
  2: '评论',
  3: '服务器',
  4: '用户',
} // 举报类型映射

const reportPage = ref({
  page: 1,
  total: 0,
  limit: 3,
})

const reportList = ref<ReportType[]>([]) // 帖子列表数据
const reportInfoModal = ref(false) // 封禁帖子模态框状态
const currentReport = ref(-1) // 当前操作的帖子ID
const currentReportRemark = ref('') // 当前操作的帖子备注内容
const reportUpdateModal = ref(false) // 更新帖子模态框状态

const toPage = (page: number) => {
  reportPage.value.page = page
  getPosts()
}

const search = () => {
  reportPage.value.page = 1 // 重置页码
  getPosts() // 重新获取帖子列表
}

const getPosts = () => {
  const params: ReportDto = {}

  /** 搜索状态 */
  const searchStatusValue =
    typeof searchStatus.value === 'object'
      ? searchStatus.value.value
      : searchStatus.value
  /** 目标类型 */
  const reportTypValue =
    typeof reportTypeBar.value === 'object'
      ? reportTypeBar.value.value
      : reportTypeBar.value
  /** 搜索内容类型 */
  const searchTypeValue =
    typeof searchType.value === 'object'
      ? searchType.value.value
      : searchType.value

  params.page = reportPage.value.page // 当前页码
  params.limit = reportPage.value.limit // 每页数量

  if (searchTypeValue !== 0 && searchReportValue.value) {
    switch (searchTypeValue) {
      case 0:
        params.userId = searchReportValue.value // 搜索举报者ID
        break
      case 1:
        params.targetId = searchReportValue.value // 搜索举报目标ID
        break
      case 2:
        params.handlerId = searchReportValue.value // 搜索举报目标ID
        break
    }
  }
  if (searchStatusValue !== 0) {
    params.status = searchStatusValue // 帖子状态
  }

  if (reportTypValue !== 0) {
    params.targetType = reportTypValue // 举报类型
  }

  reportApi
    .getReportList(params)
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        reportList.value = res.data.data.list.map((item: ReportType) => {
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          return item
        })
        reportPage.value.limit = res.data.data.limit || 3
        reportPage.value.page = res.data.data.page || 1
        reportPage.value.total = res.data.data.total || 0
      }
    })
    .catch((error) => {
      console.error('请求错误:', error.msg)
    })
}

const reportInfo = (index: number) => {
  currentReport.value = index // 设置当前操作的帖子
  reportInfoModal.value = true
}

const updateReport = (index: number) => {
  const item = reportList.value[index]
  const currentReportStatusValue =
    typeof currentReportStatus.value === 'object'
      ? currentReportStatus.value.value
      : currentReportStatus.value
  if (!reportUpdateModal.value) {
    currentReport.value = index // 设置当前操作的帖子
    currentReportRemark.value = item.result || ''
    currentReportStatus.value = item.status // 设置当前帖子状态
    reportUpdateModal.value = true
    return
  }
  reportApi
    .updateReport({
      id: item.id,
      result: currentReportRemark.value,
      status: currentReportStatusValue,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        reportUpdateModal.value = false
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
