<template>
  <div ref="chartContainer" :style="{ width, height }"></div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useThemeStore } from '@/stores/global/themeStore'

const themeStore = useThemeStore()

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  width: {
    type: String,
    default: '50%',
  },
  height: {
    type: String,
    default: '20rem',
  },
})

const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
const darkTheme = {
  color: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ],

  title: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
  backgroundColor: '#2A2F34',

  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.4)',
      },
    },

    axisLabel: {
      show: true,
      color: 'rgba(255,255,255,0.4)',
    },
  },

  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.4)',
      },
    },

    axisLabel: {
      show: true,
      color: 'rgba(255,255,255,0.4)',
    },

    splitLine: {
      show: true,
      lineStyle: {
        color: ['#444546'],
      },
    },
  },
}

// 初始化图表
const initChart = () => {
  // 根据 Pinia 的 darkTheme 状态选择主题
  const theme = themeStore.darkTheme ? 'darkTheme' : 'light'

  chartInstance?.dispose()
  chartInstance = echarts.init(chartContainer.value, theme)

  chartInstance.setOption({
    ...props.option,
  })
}

// 监听配置变化
watch(
  () => props.option,
  (newVal) => {
    chartInstance?.setOption(newVal)
  },
  { deep: true }
)

// 生命周期
onBeforeUnmount(() => {
  chartInstance?.dispose()
})

// 初始化
onMounted(() => {
  echarts.registerTheme('darkTheme', darkTheme)
  initChart()

  // 监听 Pinia 的 darkTheme 变化
  watch(
    () => themeStore.darkTheme,
    () => {
      initChart() // 主题变化时重新初始化图表
    },
    { immediate: true } // 首次加载时立即执行
  )
})
</script>
