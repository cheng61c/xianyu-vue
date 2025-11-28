<template>
  <ScSearch
    key="user-post-search"
    :placeholder="$t('t.sou-suo-tie-zi-biao-ti')"
    @search="search"
    v-model="searchText"
    :searchType="2"
    class="max-w-6xl min-w-4xl w-full" />

  <Card v-if="!userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>

  <Card
    v-if="userStore.isLogin"
    v-for="(post, postIndex) in resStore.posts"
    :key="post.id"
    class="stats max-w-6xl min-w-4xl w-full">
    <div class="flex justify-center items-center">
      <!-- 左侧封面图 -->
      <div v-if="post.cover" class="relative w-40 h-24 flex-shrink-0">
        <ScImage
          :src="post.cover"
          :alt="$t('t.feng-mian-tu')"
          class="w-full h-full object-cover rounded" />
        <!-- <span
          class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded"
          >00:25</span
        > -->
      </div>

      <!-- 右侧文字信息 -->
      <div class="ml-4 flex flex-col justify-between flex-grow h-24">
        <!-- 标题 -->
        <div
          class="flex items-center gap-2 break-all"
          @click.stop="
            router.push({ name: 'postDetails', params: { postId: post.id } })
          ">
          {{ post.title }}
          <ScTag size="sm" status="info">
            {{ typeLabelMap[post.fileType as keyof typeof typeLabelMap] }}
          </ScTag>
          <ScTag
            v-if="post.status == 1 || post.status == 3"
            size="sm"
            :status="post.visible == 1 ? 'success' : 'warning'">
            {{ post.visible == 1 ? $t('b.zheng-chang') : $t('b.xia-jia') }}
          </ScTag>
          <ScTag v-if="post.status == 2" size="sm" status="error">
            {{ $t('b.feng-jin') }}
          </ScTag>
        </div>
        <!-- 时间 -->
        <div class="text-sm text-gray-500">{{ post.createdAt }}</div>
        <!-- 底部数据 -->
        <div class="flex items-center text-sm text-gray-500 space-x-4 mt-2">
          <ScButton
            class="flex items-center"
            :icon="Eye"
            iconSize="16"
            noBg
            noPd>
            {{ post.views }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="MessageSquare"
            iconSize="16"
            noBg
            noPd>
            {{ post.commentCount }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="ThumbsUp"
            iconSize="16"
            noBg
            noPd>
            {{ post.likeCount }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="ThumbsDown"
            iconSize="16"
            noBg
            noPd>
            {{ post.badCount }}
          </ScButton>
          <ScButton
            class="flex items-center"
            :icon="Flame"
            iconSize="16"
            noBg
            noPd>
            {{ post.heat }} </ScButton
          ><ScButton
            class="flex items-center"
            :icon="Package"
            iconSize="16"
            noBg
            noPd>
            {{ post.postVersionCount }}
          </ScButton>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 h-24 items-center justify-end flex-wrap">
        <ScButton
          class="text-sm px-4 border border-gray hover:border-active"
          :icon="SquarePen"
          :iconSize="16"
          @click="
            $router.push({ name: 'publishPost', params: { postId: post.id } })
          ">
          {{ $t('b.bian-ji') }}
        </ScButton>
        <ScButton
          class="text-sm px-4 border border-gray hover:border-active"
          :icon="iconMap[post.fileType as keyof typeof iconMap]"
          :iconSize="16"
          @click="onPackageModal(post.id)">
          {{ $t('b.ban-ben') }}
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
    </div>
  </Card>

  <div v-if="userStore.isLogin" class="max-w-6xl min-w-4xl w-full">
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
    </div>
    <Pagination
      v-else-if="resStore.posts.length"
      :current-page="resStore.pagination.page"
      :total-items="resStore.pagination.count"
      :page-size="resStore.pagination.limit"
      @page-change="toPage" />
  </div>

  <EmptyState
    v-if="resStore.posts.length === 0 && userStore.isLogin"
    :title="$t('t.zan-wu-tie-zi')"
    :description="$t('t.ni-huan-mei-you-fa-bu-ren-he-tie-zio')"
    iconSize="64"
    iconColor="#ccc"
    :icon="Package"
    class="mt-8"
    :action="$t('b.qian-wang-fa-tie')"
    :actionIcon="SquareArrowOutUpRight"
    @action-click="$router.push({ name: 'publishPost' })" />

  <ScModal v-model="openPackageList">
    <Card class="gap-4 w-4xl h-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          {{ $t('d.tie-zi-ban-ben-lie-biao') }}
        </h3>
        <ScButton
          class="text-sm"
          @click="openPackageList = false"
          :icon="Minimize2"
          iconSize="22"
          noBg
          noPd>
        </ScButton>
      </div>
      <div
        v-if="resStore.packageList.length === 0"
        class="overflow-y-auto h-full">
        <EmptyState
          :description="$t('d.zan-wu-ban-ben-xin-xi')"
          :action="$t('b.dian-ji-tian-jia-ban-ben')"
          :actionIcon="PackagePlus"
          actionIconSize="20"
          @action-click="toCreateResource()" />
      </div>

      <div v-if="resStore.packageList.length" class="w-full">
        <!-- 表头 -->
        <div class="flex font-semibold py-2 px-4 border-b border-gray-content">
          <div class="flex-1">{{ $t('b.ban-ben') }}</div>
          <div class="flex-[1.2]">{{ $t('b.biao-ti') }}</div>
          <div class="flex-1">{{ $t('b.wen-jian-shu') }}</div>
          <div class="flex-1">{{ $t('b.chuang-jian-shi-jian') }}</div>
          <div class="flex-[1.1]">{{ $t('b.cao-zuo') }}</div>
        </div>

        <!-- 表格行 -->
        <div
          class="w-full py-2 px-4 border-b border-gray-content"
          v-for="(pkg, index) in resStore.packageList"
          :key="index">
          <div class="flex items-center mb-2">
            <div class="flex-1 flex">
              <ScTag :type="pkg.fileType" size="sm" status="info">
                v {{ pkg.version }}
              </ScTag>
            </div>
            <div class="flex-[1.2]">{{ pkg.title }}</div>
            <div class="flex-1">{{ pkg.files.length }}</div>
            <div class="flex-1">{{ pkg.createdAt }}</div>
            <div class="flex-[1.1] flex gap-2 justify-end flex-wrap">
              <ScButton
                class="text-sm px-4 border border-gray"
                :icon="SquarePen"
                :iconSize="16"
                @click="toEditResource(pkg.id)">
                {{ $t('b.bian-ji') }}
              </ScButton>

              <ScButton
                class="text-sm text-error px-4 border hover:border-active"
                :icon="Trash2"
                :iconSize="16"
                @click="deletePkg(index)">
                {{ $t('b.shan-chu') }}
              </ScButton>
            </div>
          </div>
          <!-- 文件列表 -->
          <div
            v-for="(file, fileIndex) in pkg.files"
            :key="fileIndex"
            class="flex items-center cursor-pointer hover:bg-gray-content/20">
            <div class="flex-[3] flex gap-2">
              <CornerDownRight :size="24" />
              <div>{{ file.filename }}</div>
              <div class="self-end text-sm text-gray-content">
                {{ formatFileSize(file.size) }}
              </div>
            </div>
            <div class="flex-1">
              {{ $t('d.xia-zai-ci-shu') }} <span>{{ file.downloadCount }}</span>
            </div>
            <div class="flex-[1.1] flex gap-2 py-1 justify-end">
              <ScButton
                class="text-sm px-4 border hover:border-active"
                :icon="Download"
                :iconSize="16"
                noPd
                @click="downloadApi.download(file.url)">
                {{ $t('b.xia-zai') }}
              </ScButton>
            </div>
          </div>
        </div>
      </div>
      <ScButton
        v-if="resStore.packageList.length"
        class="w-full"
        @click="toCreateResource()"
        :icon="PackagePlus"
        iconSize="20"
        noBg
        Border>
        {{ $t('b.tian-jia-xin-ban-ben') }}
      </ScButton>
    </Card>
  </ScModal>

  <ScModal v-model="resStore.isDeletePost">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">
        {{ $t('t.que-ren-shan-chu-tie-zi') }}
      </div>
      <div class="">
        {{ $t('t.tie-zi-biao-ti') }}
        <span>{{ resStore.posts[resStore.currenPostId].title }}</span>
      </div>
      <div class="mb-4">
        <span>{{ $t('d.ni-que-ding-yao-shan-chu-ci-tie-zi-ma') }}</span>
        <span class="text-error">{{ $t('d.ci-cao-zuo-wu-fa-che-hui') }}</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="resStore.isDeletePost = false">
          {{ $t('b.qu-xiao') }}
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePost">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="resStore.isDeletePkg">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">
        {{ $t('d.que-ding-shan-chu-ban-ben') }}
      </div>
      <div class="flex gap-2">
        {{ $t('b.ban-ben-hao') }}
        <ScTag
          :type="resStore.packageList[resStore.currenPkgId].fileType"
          size="sm"
          status="info">
          v {{ resStore.packageList[resStore.currenPkgId].version }}
        </ScTag>
      </div>
      <div class="">
        {{ $t('d.ban-ben-biao-ti') }}
        <span>{{ resStore.packageList[resStore.currenPkgId].title }}</span>
      </div>
      <div class="mb-4">
        <span>{{ $t('d.ni-que-ding-yao-shan-chu-ci-ban-ben-ma') }}</span>
        <span class="text-error">{{ $t('d.ci-cao-zuo-wu-fa-che-hui') }}</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="resStore.isDeletePkg = false">
          {{ $t('b.qu-xiao') }}
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePackage">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { useUserStore } from '@/stores/module/user/userStore'
import { onMounted, ref } from 'vue'
import {
  ThumbsUp,
  ThumbsDown,
  CornerDownRight,
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  MessageSquare,
  Flame,
  PackagePlus,
  Trash2,
  Minimize2,
  Eye,
  SquarePen,
  Download,
  SquareArrowOutUpRight,
} from 'lucide-vue-next'
import { postApi, downloadApi } from '@/apis'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { iconMap, useTypeLabelMap } from '@/utils/fileType'
import { formatFileSize } from '@/utils/format'
import ScImage from '@/components/common/ScImage.vue'
import ScButton from '@/components/common/ScButton.vue'
import ScModal from '@/components/common/ScModal.vue'
import ScTag from '@/components/common/ScTag.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ScDivider from '@/components/common/ScDivider.vue'
import ScSearch from '@/components/pc/user/ScSearch.vue'
import Pagination from '@/components/common/Pagination.vue'

import { useI18n } from 'vue-i18n'
import {
  getPackageList,
  searchUserResource,
  deletePackage,
} from '@/stores/module/userResource/service'
import { useUserResourceStore } from '@/stores/module/userResource/userResourceStore'
import { getPosts } from '@/stores/module/userResource/service'

const { t } = useI18n()
const userStore = useUserStore()
const resStore = useUserResourceStore()
const toast = useToast()
const typeLabelMap = useTypeLabelMap(t)
const openPackageList = ref(false)
const loading = ref(false)
const searchText = ref('')
const router = useRouter()

const search = (value: string, click: boolean, type: string) => {
  resStore.pagination.page = 1
  searchUserResource(t, value, click, type)
}

const unpublishItem = (postIndex: number) => {
  const item = resStore.posts[postIndex]
  if (!item) {
    toast.error(t('t.tie-zi-bu-cun-zai'))
    return
  }
  postApi
    .updatePost({
      id: item.id,
      visible: item.visible == 1 ? 0 : 1,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts(t)
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

const onPackageModal = (id: number) => {
  resStore.currenPostId = id
  getPackageList(t)
  openPackageList.value = !openPackageList.value
}

const toCreateResource = () => {
  openPackageList.value = false
  router.push({
    name: 'publishResource',
    query: {
      postId: resStore.currenPostId,
    },
    params: {
      postId: resStore.currenPostId,
    },
  })
}

const toEditResource = (id: number) => {
  openPackageList.value = false
  router.push({
    name: 'publishResource',
    query: {
      resourceId: id,
    },
    params: {
      postId: resStore.currenPostId,
    },
  })
}

const deleteItem = (postIndex: number) => {
  resStore.isDeletePost = true
  resStore.currenPostId = postIndex
}
const deletePkg = (pkgId: number) => {
  resStore.isDeletePkg = true
  resStore.currenPostId = pkgId
}

const deletePost = () => {
  const item = resStore.posts[resStore.currenPostId]
  if (!item) {
    toast.error(t('t.tie-zi-bu-cun-zai'))
    return
  }
  postApi
    .deletePost(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts(t)
        toast.success(t('t.shan-chu-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
  resStore.isDeletePost = false
}

const toPage = (page: number) => {
  resStore.pagination.page = page
  getPosts(t)
}

onMounted(() => {
  getPosts(t)
})
</script>
