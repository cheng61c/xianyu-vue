export interface EchartsOption {
  title: { text: string }
  tooltip: { trigger: string }
  xAxis: {
    type: string
    data: never[]
  }
  yAxis: { type: string; min?: number; interval: number }
  series: [
    {
      data: never[]
      type: string
      smooth: boolean
    },
  ]
}
