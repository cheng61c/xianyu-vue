<template>
  <div v-if="!loading && panelInfo" class="flex flex-col gap-4">
    <Card class="stats w-full" noCol noPg>
      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('d.zong-zhu-ce-shu') }}</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalUsers }}
        </div>
        <div class="stat-desc">
          {{
            $t('d.zui-jin-zhu-ce-panelinforecentregisterstatscount', [
              panelInfo.recentRegisterStats.count,
            ])
          }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('d.zui-jin-deng-lu') }}</div>
        <div class="stat-value text-primary">
          {{ panelInfo.recentLoginStats.count }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('b.tie-zi-shu') }}</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalPosts }}
        </div>
        <div class="stat-desc">
          {{
            $t('d.zui-jin-geng-xin-panelinforecentpoststatscount', [
              panelInfo.recentPostStats.count,
            ])
          }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('d.zi-yuan-shu') }}</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalResourcePosts }}
        </div>
        <div class="stat-desc">
          {{
            $t('d.zui-jin-geng-xin-panelinforecentresourcepoststatscount', [
              panelInfo.recentResourcePostStats.count,
            ])
          }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('d.ping-lun-shu') }}</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalComments }}
        </div>
        <div class="stat-desc">
          {{
            $t('d.zui-jin-geng-xin-panelinforecentcommentstatscount', [
              panelInfo.recentCommentStats.count,
            ])
          }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('b.wen-jian-shu') }}</div>
        <div class="stat-value text-primary">
          {{ panelInfo.totalFiles }}
        </div>
        <div class="stat-desc">
          {{
            $t('d.yi-guo-lv-panelinfototalpendingfiles', [
              panelInfo.totalPendingFiles,
            ])
          }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">{{ $t('nav.fu-wu-qi') }}</div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(true)
const panelInfo = ref<AdminPanelInfo>()
onMounted(async () => {
  panelInfo.value = await getPanelInfo(t)
  loading.value = false
})
</script>
