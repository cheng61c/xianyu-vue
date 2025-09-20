<template>
  <Card
    v-if="userStore.isLogin"
    v-for="(post, postIndex) in userServerStore.posts"
    :key="post.id"
    class="w-full">
    <div class="flex justify-between items-center">
      <!-- 右侧文字信息 -->
      <div class="flex flex-col">
        <!-- 标题 -->
        <div class="flex items-center gap-2">
          {{ post.title }}
          <ScTag
            v-if="post.status == 1 || post.status == 3"
            size="sm"
            :status="post.visible == 1 ? 'success' : 'warning'">
            {{ post.visible == 1 ? $t('b.zheng-chang') : $t('b.xia-jia') }}
          </ScTag>
          <ScTag v-if="post.status == 2" size="sm" status="error">
            {{ $t('b.feng-jin') }}
          </ScTag>
          <ScTag size="sm" status="info">
            {{ post.level == 1 ? $t('b.ge-ren-fu') : $t('b.she-qu-fu') }}
          </ScTag>
        </div>
      </div>
    </div>
    <div>
      {{ $t('d.fa-bu-shi-jian') }} <span>{{ post.createdAt }}</span>
    </div>
    <div>
      {{ $t('d.fu-wu-qi-di-zhi') }} <span>{{ post.url }}</span>
    </div>

    <div class="flex gap-2 items-center flex-wrap border-t border-gray/40 pt-2">
      <ScButton
        class="text-sm px-4 border border-gray hover:border-active"
        :icon="SquarePen"
        :iconSize="16"
        disabled>
        {{ $t('b.bian-ji') }}
      </ScButton>
      <ScButton
        class="text-sm px-4 border border-gray hover:border-active"
        :icon="post.visible == 1 ? ArrowDownFromLine : ArrowUpToLine"
        :iconSize="16"
        @click="unpublishItem(postIndex)">
        {{ post.visible == 1 ? $t('b.xia-jia') : $t('b.fa-bu') }}
      </ScButton>
      <ScButton
        class="text-sm text-error px-4 border border-gray hover:border-active"
        :icon="Trash2"
        :iconSize="16"
        @click="deleteItem(postIndex)">
        {{ $t('b.shan-chu') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="!userStore.isLogin" class="w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>

  <div v-if="userStore.isLogin" class="w-full">
    <div v-if="userServerStore.resLoding" class="flex flex-col gap-4">
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
    </div>
    <Pagination
      v-else-if="userServerStore.posts.length"
      :current-page="userServerStore.pagination.page"
      :total-items="userServerStore.pagination.total"
      :page-size="userServerStore.pagination.limit"
      @page-change="toPage" />
  </div>

  <EmptyState
    v-if="userServerStore.posts.length === 0 && userStore.isLogin"
    :title="$t('t.zan-wu-tie-zi')"
    :description="$t('t.ni-huan-mei-you-fa-bu-ren-he-tie-zio')"
    iconSize="64"
    iconColor="#ccc"
    :icon="Package"
    class="mt-8"
    :action="$t('b.qian-wang-fa-tie')"
    :actionIcon="SquareArrowOutUpRight"
    @action-click="$router.push({ name: 'publish' })" />

  <ScModal v-model="userServerStore.modal.isDeletePost">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">
        {{ $t('t.que-ren-shan-chu-tie-zi') }}
      </div>
      <div class="">
        {{ $t('t.tie-zi-biao-ti') }}
        <span>{{
          userServerStore.posts[userServerStore.currentPostIndex].title
        }}</span>
      </div>
      <div class="mb-4">
        <span>{{ $t('d.ni-que-ding-yao-shan-chu-ci-tie-zi-ma') }}</span>
        <span class="text-error">{{ $t('d.ci-cao-zuo-wu-fa-che-hui') }}</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton
          class="text-sm border"
          @click="userServerStore.modal.isDeletePost = false">
          {{ $t('b.qu-xiao') }}
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePost">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { onMounted } from 'vue'
import {
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  Trash2,
  SquarePen,
  SquareArrowOutUpRight,
} from 'lucide-vue-next'

import ScButton from '@/components/common/ScButton.vue'
import ScDivider from '@/components/common/ScDivider.vue'
import ScModal from '@/components/common/ScModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import ScTag from '@/components/common/ScTag.vue'
import { useUserServerStore } from '@/stores/module/userServer/userServerStore'
import { useUserStore } from '@/stores/module/user/userStore'
import {
  getPosts,
  deletePost,
  deleteItem,
  toPage,
  unpublishItem,
} from '@/stores/module/userServer/service'

const userServerStore = useUserServerStore()
const userStore = useUserStore()

onMounted(() => {
  getPosts()
})
</script>
