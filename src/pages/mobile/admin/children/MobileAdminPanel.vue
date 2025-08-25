<template>
  <div v-if="!loading && panelInfo" class="flex flex-col gap-4">
    <Card class="stats w-full" noCol noPg>
      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">总注册数</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalUsers }}
        </div>
        <div class="stat-desc">
          最近注册 {{ panelInfo.recentRegisterStats.count }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">最近登录</div>
        <div class="stat-value text-primary">
          {{ panelInfo.recentLoginStats.count }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">帖子数</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalPosts }}
        </div>
        <div class="stat-desc">
          最近更新 {{ panelInfo.recentPostStats.count }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">资源数</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalResourcePosts }}
        </div>
        <div class="stat-desc">
          最近更新 {{ panelInfo.recentResourcePostStats.count }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">评论数</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalComments }}
        </div>
        <div class="stat-desc">
          最近更新 {{ panelInfo.recentCommentStats.count }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">文件数</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalFiles }}
        </div>
        <div class="stat-desc">已过滤 {{ panelInfo.totalPendingFiles }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">服务器</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalServerPosts }}
        </div>
      </div>
    </Card>
    <Card>
      <EChartsWrapper width="100%" :option="panelInfo.recentLoginStats.chart" />
      <EChartsWrapper
        width="100%"
        :option="panelInfo.recentRegisterStats.chart" />
      <EChartsWrapper width="100%" :option="panelInfo.recentPostStats.chart" />
      <EChartsWrapper
        width="100%"
        :option="panelInfo.recentResourcePostStats.chart" />
      <EChartsWrapper
        width="100%"
        :option="panelInfo.recentCommentStats.chart" />
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import EChartsWrapper from '@/components/common/EChartsWrapper.vue'
import { getPanelInfo } from '@/stores/module/admin/service'
import type { AdminPanelInfo } from '@/types/PanelInfo'
import { onMounted, ref } from 'vue'

const loading = ref(true)
const panelInfo = ref<AdminPanelInfo>()
onMounted(async () => {
  panelInfo.value = await getPanelInfo()
  loading.value = false
})
</script>
