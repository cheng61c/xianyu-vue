<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <ScInput
        v-model="searchReportValue"
        :placeholder="$t('b.sou-suo')"
        class="w-full" />
    </div>

    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        :placeholder="$t('b.sou-suo-ju-bao-zhe-id')"
        class="flex-1" />
      <ScButton class="px-4" Border @click="search">
        {{ $t('b.sou-suo') }}
      </ScButton>
      <ScButton class="px-4" Border @click="getPosts">
        {{ $t('b.shua-xin') }}
      </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>{{ $t('d.ju-bao-lei-xing') }}</span>
        <Dropdown
          v-model="reportTypeBar"
          :options="reportTypeOptions"
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

  <Card v-if="reportList.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('b.mu-biao-lei-xing') }}</th>
            <th>{{ $t('b.mu-biao-id') }}</th>
            <th>{{ $t('b.ju-bao-zhe') }}</th>
            <th>{{ $t('b.chu-li-ren') }}</th>
            <th>{{ $t('b.chu-li-zhuang-tai') }}</th>
            <th>{{ $t('b.chu-li-bei-zhu') }}</th>
            <th>{{ $t('b.chuang-jian-shi-jian') }}</th>
            <th>{{ $t('b.geng-xin-shi-jian') }}</th>
            <th>{{ $t('b.cao-zuo') }}</th>
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
                <ScRole size="xs" :user="report.creator" />
              </div>
            </td>
            <td>
              <div class="flex items-center gap-2 flex-wrap">
                {{ report.handler?.nickname ?? 'null' }}
                <ScRole size="xs" :user="report.handler" />
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
                  {{ $t('b.cha-kan-xiang-qing') }}
                </ScButton>
                <ScButton @click="updateReport(index)" Border>
                  {{ $t('b.shen-he') }}
                </ScButton>
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
    :title="$t('t.zan-wu-tie-zi')"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    :action="'点击刷新'"
    :actionIcon="RotateCcw"
    @action-click="toPage" />

  <ScModal v-model="reportInfoModal">
    <Card class="w-[95vw] max-h-[80vh] overflow-y-auto">
      <div class="text-xl mb-4">{{ $t('d.ju-bao-xiang-qing') }}</div>

      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.ju-bao-mu-biao-id') }}</span>
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
        <span class="text-gray-content">{{
          $t('d.ju-bao-mu-biao-lei-xing')
        }}</span>
        <span class="text-gray-content">
          {{ reportTypeBarMap[reportList[currentReport].targetType] }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.ju-bao-zhe-id') }}</span>
        <div class="flex items-center gap-2 flex-wrap">
          {{ reportList[currentReport].creator.nickname }}
          <ScRole size="xs" :user="reportList[currentReport].creator" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.chu-li-ren-id') }}</span>
        <div class="flex items-center gap-2 flex-wrap">
          {{ reportList[currentReport].handler?.nickname ?? '未知' }}
          <ScRole size="xs" :user="reportList[currentReport].handler" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.ju-bao-li-you') }}</span>
        <div class="text-gray-content">
          {{ reportList[currentReport].reason }}
        </div>
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="reportInfoModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="reportUpdateModal">
    <Card class="w-[95vw] max-h-[80vh] overflow-y-auto">
      <div class="text-xl mb-4">{{ $t('b.shen-he') }}</div>

      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.ju-bao-mu-biao-id') }}</span>
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
        <span class="text-gray-content">{{
          $t('d.ju-bao-mu-biao-lei-xing')
        }}</span>
        <span class="text-gray-content">
          {{ reportTypeBarMap[reportList[currentReport].targetType] }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.ju-bao-zhe-id') }}</span>
        <div class="flex items-center gap-2 flex-wrap">
          {{ reportList[currentReport].creator.nickname }}
          <ScRole size="xs" :user="reportList[currentReport].creator" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.ju-bao-li-you') }}</span>
        <div class="text-gray-content">
          {{ reportList[currentReport].reason }}
        </div>
      </div>

      <div class="border border-gray/60 mb-4"></div>

      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.she-zhi-zhuang-tai') }}</span>
        <div class="flex items-center gap-2 flex-wrap">
          <Dropdown
            v-model="currentReportStatus"
            :options="searchStatusOptions"
            :placeholder="$t('b.quan-bu')"
            class="w-40" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-content">{{ $t('d.chu-li-bei-zhu') }}</span>
      </div>
      <ScInput
        v-model="currentReportRemark"
        :placeholder="$t('d.qing-shu-ru-chu-li-bei-zhu')"
        multiline
        :rows="5"
        :resizable="false"
        class="mt-2 mb-4" />
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateReport(currentReport)" Border>
          {{ $t('b.ti-jiao') }}
        </ScButton>
        <ScButton class="px-4" @click="reportUpdateModal = false" Border>
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
import { reportApi } from '@/apis'
import Pagination from '@/components/common/Pagination.vue'
// import ScTag from '@/components/common/ScTag.vue'
import { formatTimeOrAgo } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'
import type { ReportDto, ReportType } from '@/types/Report'
import { useI18n } from 'vue-i18n'
import ScRole from '@/components/common/ScRole.vue'

const { t } = useI18n()
const searchReportValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 帖子状态
const currentReportStatus = ref<number | { value: number; label: string }>(0) // 当前操作的帖子状态
const searchStatusOptions = [
  { value: 0, label: t('b.quan-bu') },
  { value: 1, label: t('b.wei-chu-li') },
  { value: 2, label: t('b.feng-jin') },
  { value: 3, label: t('b.bu-feng-jin') },
]
const searchStatusMap: { [key: number]: string } = {
  0: t('b.quan-bu'),
  1: t('b.wei-chu-li'),
  2: t('b.feng-jin'),
  3: t('b.bu-feng-jin'),
}

const searchType = ref<number | { value: number; label: string }>(0) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: t('b.sou-suo-ju-bao-zhe-id') },
  { value: 1, label: t('b.sou-suo-ju-bao-mu-biao-id') },
  { value: 2, label: t('b.sou-suo-chu-li-ren-id') },
]

const reportTypeBar = ref<number | { value: number; label: string }>(0) // 服务器等级
const reportTypeOptions = [
  { value: 0, label: t('b.quan-bu') },
  { value: 1, label: t('nav.tie-zi') },
  { value: 2, label: t('nav.ping-lun') },
  { value: 3, label: t('nav.fu-wu-qi') },
  { value: 4, label: t('b.yong-hu') },
]
const reportTypeBarMap: { [key: number]: string } = {
  0: t('b.quan-bu'),
  1: t('nav.tie-zi'),
  2: t('nav.ping-lun'),
  3: t('nav.fu-wu-qi'),
  4: t('b.yong-hu'),
} // 举报类型映射

const reportPage = ref({
  page: 1,
  total: 0,
  limit: 10,
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
          item.createdAt = formatTimeOrAgo(item.createdAt, t)
          item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
          return item
        })
        reportPage.value.limit = res.data.data.limit || 10
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
