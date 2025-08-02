<template>
  <div>
    <Card class="overflow-hidden">
      <div>
        <div class="text-lg font-bold">资源评分</div>
        <div class="flex justify-center items-center gap-4">
          <div class="pr-8 flex flex-col">
            <div :class="steamRatingLabel.colorClass">
              {{ steamRatingLabel.label }}
            </div>
            <div class="text-[3.5rem] text-center">
              {{ scoreSummary.averageScore.toFixed(1) }}
            </div>

            <div class="text-sm">评分人数: {{ scoreSummary.totalCount }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <div
              v-for="[score, count] in sortedScoreList"
              :key="score"
              class="flex gap-2 items-center">
              {{ score }}

              <progress
                class="progress w-[10rem] h-3 bg-gray-200"
                :value="getPercentage(count)"
                max="100"></progress>
            </div>
          </div>
        </div>
      </div>
      <ScButton
        class="text-sm text-gray-content"
        @click="showModal = true"
        noBg
        noPd>
        共 {{ scoreList.length }} 条评分
        <template #endIcon>
          <ArrowRight :size="18" />
        </template>
      </ScButton>
    </Card>

    <ScModal v-model="showModal">
      <Card class="gap-4 h-full max-h-[90dvh] overflow-y-auto">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">评分详情</h3>
          <ScButton
            @click="showModal = false"
            :icon="X"
            :icon-size="24"
            noBg
            noPd>
          </ScButton>
        </div>

        <div>
          <div class="flex gap-4">
            <span>对该资源评分: </span>
            <ReadonlyRating
              v-model:value="scoreInput"
              :readonly="false"
              colorClass="bg-active"
              class="mb-4" />
          </div>
          <CommentInput
            :post-id="props.postId"
            @submit="sendScore"
            submitText="发表"
            placeholder="对该资源的评价是..." />
        </div>

        <div
          v-for="(score, index) in scoreList"
          :key="score.id"
          class="border-gray/80 py-2 flex">
          <div class="mr-4 pt-2">
            <Avatar :src="score.author.headImg" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="mb-2">
                <p>
                  {{ score.author.nickname }}
                </p>
                <p class="text-text-gray text-sm">
                  发布于 {{ score.createdAt }}
                  {{
                    score.updatedAt != score.createdAt
                      ? `更新于 ${score.updatedAt}`
                      : ''
                  }}
                </p>
              </div>
              <ReadonlyRating
                :value="score.score"
                colorClass="bg-active"
                size="xs" />
            </div>

            <div class="mb-2">
              {{ score.content }}
            </div>
            <!-- 图片 -->
            <div v-if="score.image" class="flex flex-wrap gap-2 mb-2">
              <img
                v-for="(img, replyImgIndex) in score.image"
                :key="replyImgIndex"
                :src="img"
                alt="评论图片"
                class="w-20 h-20 object-cover rounded-md cursor-pointer"
                @click="openImg(img)" />
            </div>

            <div class="flex justify-end gap-4 items-center">
              <div class="text-sm text-gray-content">这对你是否有帮助</div>
              <div class="flex gap-4">
                <ScButton
                  class="text-sm border"
                  :class="{
                    'text-success border-success': score.isLiked,
                    'text-gray-content border-gray': !score.isLiked,
                  }"
                  @click="scoreAction(index, 'like')"
                  noBg>
                  是 ({{ score.likeCount }})
                </ScButton>
                <ScButton
                  class="text-sm border"
                  :class="{
                    'text-error border-error': score.isBaded,
                    'text-gray-content border-gray': !score.isBaded,
                  }"
                  @click="scoreAction(index, 'bad')"
                  noBg>
                  否 ({{ score.badCount }})</ScButton
                >
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ScModal>

    <ScModal v-model="imageModal">
      <div class="relative w-[90vw] h-[90vh] overflow-hidden">
        <ZoomableImage :src="imgurl" @click-outside="imageModal = false" />
        <button
          class="absolute z-[10] top-[5rem] right-[5rem] rounded-full w-10 h-10 border border-error hover:border-active/80 text-error hover:text-active/80"
          @click="imageModal = false">
          <X class="mx-auto" />
        </button>
      </div>
    </ScModal>
  </div>
</template>

<script setup lang="ts">
import { scoreApi } from '@/apis'
import Card from '@/components/common/Card.vue'
import { formatTimeAgo } from '@/utils/format'
import type { ScoreSummary, ScoreType } from '@/types/score'
import ReadonlyRating from '@/components/common/ReadonlyRating.vue'
import { ref, onMounted, computed } from 'vue'
import Avatar from '@/components/common/Avatar.vue'
import { ArrowRight, X } from 'lucide-vue-next'
import ScButton from '@/components/common/ScButton.vue'
import ScModal from '@/components/common/ScModal.vue'
import CommentInput from '../comment/MobileCommentInput.vue'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/module/user/userStore'
import ZoomableImage from '@/components/common/ScZoomableImage.vue'
import { getSteamRatingLabel } from '@/utils/steamReviewLabel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const toast = useToast()
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

const scoreList = ref<ScoreType[]>([])
const scoreSummary = ref<ScoreSummary>({
  averageScore: 0,
  totalCount: 0,
  scoreDistribution: {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
  },
})
const steamRatingLabel = ref({
  label: '',
  colorClass: '',
})
const showModal = ref(false)
const scoreInput = ref(0)
// 图片查看弹窗相关
const imageModal = ref(false) // 图片查看弹窗
const imgurl = ref('')

const sortedScoreList = computed(() => {
  return Object.entries(scoreSummary.value.scoreDistribution).sort(
    (a, b) => Number(b[0]) - Number(a[0])
  ) // 从高到低排序（5 -> 1）
})

// 计算百分比（保留 1 位小数）
const getPercentage = (count: number): number => {
  const total = scoreSummary.value.totalCount
  if (total === 0) return 0
  return (count / total) * 100
}

const openImg = (img: string) => {
  imageModal.value = true
  imgurl.value = img
}

const getScoreList = () => {
  scoreApi
    .getScoreList(props.postId)
    .then((res) => {
      if (res.data.code == 200) {
        const data = res.data.data.list as ScoreType[]
        scoreList.value = data.map((item) => ({
          ...item,
          createdAt: formatTimeAgo(item.createdAt, t),
          updatedAt: formatTimeAgo(item.updatedAt, t),
        }))
      }
    })
    .catch((error) => {
      console.error('Error fetching score list:', error)
    })
}

const getScoreSummary = () => {
  scoreApi
    .getScoreSummary(props.postId)
    .then((res) => {
      if (res.data.code == 200) {
        const data = res.data.data
        scoreSummary.value = {
          averageScore: data.averageScore,
          totalCount: data.totalCount,
          scoreDistribution: {
            '5': data.scoreDistribution['5'] || 0,
            '4': data.scoreDistribution['4'] || 0,
            '3': data.scoreDistribution['3'] || 0,
            '2': data.scoreDistribution['2'] || 0,
            '1': data.scoreDistribution['1'] || 0,
          },
        }
        const { colorClass, label } = getSteamRatingLabel(
          data.totalCount,
          scoreSummary.value,
          t
        )
        steamRatingLabel.value.colorClass = colorClass
        steamRatingLabel.value.label = label
      }
    })
    .catch((error) => {
      console.error('Error fetching score summary:', error)
    })
}

const sendScore = (
  content: string,
  image: string[],
  _commentId: any,
  _toCommentId: any,
  clearContent: () => void
) => {
  if (!userStore.isLogin) {
    toast.error('请先登录')
    return
  }
  if (scoreInput.value <= 0) {
    toast.error('评分不能为空')
    return
  }

  const data = {
    postId: props.postId,
    score: scoreInput.value,
    content,
    image: image.length > 0 ? image : undefined, // 如果没有图片则不传
  }

  scoreApi
    .createScore(data)
    .then((res) => {
      if (res.data.code == 200) {
        toast.success('评分成功')
        getScoreList()
        getScoreSummary()
        scoreInput.value = 0 // 重置评分输入
        clearContent()
      } else {
        toast.error(res.data.msg || '评分失败，请稍后再试')
      }
    })
    .catch((error) => {
      console.error('Error sending score:', error)
      toast.error('评分失败，请稍后再试')
    })
}

const scoreAction = (index: number, actionType: 'like' | 'bad') => {
  const score = scoreList.value[index]
  if (!userStore.isLogin) {
    toast.error('请先登录')
    return
  }

  const apiMethod =
    actionType === 'like' ? scoreApi.scoreLike : scoreApi.scoreBad

  apiMethod(score.id)
    .then((res) => {
      if (res.data.code === 200) {
        score.isLiked = res.data.data.isLiked
        score.isBaded = res.data.data.isBaded
        score.likeCount = res.data.data.likeCount
        score.badCount = res.data.data.badCount
        toast.success('操作成功')
      } else {
        toast.error(res.data.msg || '操作失败，请稍后再试')
      }
    })
    .catch((error) => {
      console.error(`Error ${actionType}ing score:`, error)
      toast.error('操作失败，请稍后再试')
    })
}

onMounted(() => {
  getScoreList()
  getScoreSummary()
})
</script>
