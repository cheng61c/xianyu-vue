<template>
  <ScSearch
    key="user-post-search"
    :placeholder="$t('t.sou-suo-tie-zi-biao-ti')"
    @search="search"
    v-model="searchText"
    :searchType="2"
    class="w-full" />

  <Card v-if="!userStore.isLogin" class="w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>

  <Card
    v-if="userStore.isLogin"
    v-for="(post, postIndex) in posts"
    :key="post.id"
    class="w-full">
    <div class="flex gap-2">
      <!-- 左侧封面图 -->
      <div v-if="post.cover" class="relative w-28 flex-shrink-0">
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
      <div class="flex flex-col gap-2 w-full">
        <!-- 标题 -->
        <div
          class="flex items-center gap-2 flex-grow"
          @click.stop="
            $router.push({ name: 'postDetails', params: { postId: post.id } })
          ">
          <span class="font-bold">{{ post.title }}</span>
          <div class="flex items-center gap-1 flex-shrink-0">
            <ScTag size="sm" status="info">
              {{ typeLabelMap[post.fileType as keyof typeof typeLabelMap] }}
            </ScTag>
            <ScTag
              v-if="post.status == 1 || post.status == 3"
              size="sm"
              :status="post.visible == 1 ? 'success' : 'warning'">
              {{ post.visible == 1 ? '发布中' : '下架' }}
            </ScTag>
            <ScTag v-if="post.status == 2" size="sm" status="error">
              {{ $t('b.feng-jin') }}
            </ScTag>
          </div>
        </div>

        <div class="flex w-full items-center gap-2 justify-between">
          <!-- 时间 -->
          <div class="text-end text-sm text-gray-content">
            {{ post.createdAt }}
          </div>
        </div>
        <div>
          {{ post.content }}
        </div>
      </div>
    </div>
    <!-- 底部数据 -->
    <div
      class="flex justify-between items-center space-x-4 pt-2 border-t border-gray/40">
      <ScButton class="flex items-center" noBg noPd>
        <div class="flex gap-1 items-center text-gray-content">
          <Eye :size="18" />
          <span>{{ post.views }}</span>
        </div>
      </ScButton>
      <ScButton class="flex items-center" noBg noPd>
        <div class="flex gap-1 items-center text-gray-content">
          <MessageSquare :size="18" />
          <span>{{ post.commentCount }}</span>
        </div>
      </ScButton>
      <ScButton class="flex items-center" noBg noPd>
        <div class="flex gap-1 items-center text-gray-content">
          <ThumbsUp :size="18" />
          <span>{{ post.likeCount }}</span>
        </div>
      </ScButton>
      <ScButton class="flex items-center" noBg noPd>
        <div class="flex gap-1 items-center text-gray-content">
          <ThumbsDown :size="18" />
          <span>{{ post.badCount }}</span>
        </div>
      </ScButton>
      <ScButton noBg noPd>
        <div class="flex gap-1 items-center text-gray-content">
          <Flame :size="18" />
          <span>{{ post.heat }}</span>
        </div>
      </ScButton>
      <ScButton noBg noPd>
        <div class="flex gap-1 items-center text-gray-content">
          <Package :size="18" />
          <span>{{ post.postVersionCount }}</span>
        </div>
      </ScButton>
    </div>

    <div
      class="flex gap-1 items-center justify-end flex-wrap border-t border-gray/40 pt-2 w-full">
      <ScButton
        class="text-sm px-4 border border-gray hover:border-active"
        :icon="SquarePen"
        :iconSize="16"
        @click="$router.push({ name: 'publish', params: { postId: post.id } })">
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
        {{ post.visible == 1 ? '下架' : '发布' }}
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

  <div v-if="userStore.isLogin" class="w-full">
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
      <div class="skeleton w-full h-20"></div>
    </div>
    <Pagination
      v-else-if="posts.length"
      :current-page="pagination.page"
      :total-items="pagination.count"
      :page-size="pagination.limit"
      @page-change="toPage" />
  </div>

  <EmptyState
    v-if="posts.length === 0 && userStore.isLogin"
    :title="$t('t.zan-wu-tie-zi')"
    :description="'你还没有发布任何帖子哦~'"
    iconSize="64"
    iconColor="#ccc"
    :icon="Package"
    class="mt-8"
    :action="'前往发帖'"
    :actionIcon="SquareArrowOutUpRight"
    @action-click="$router.push({ name: 'publish' })" />

  <ScModal v-model="openPackageList">
    <Card class="gap-4 w-[95vw] h-full max-h-[95dvh] overflow-y-auto">
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
      <div v-if="packageList.length === 0" class="overflow-y-auto h-full">
        <EmptyState
          description="暂无版本信息"
          action="点击添加版本"
          :actionIcon="PackagePlus"
          actionIconSize="20"
          @action-click="toCreateResource()" />
      </div>

      <div v-if="packageList.length" class="w-full">
        <!-- 表格行 -->
        <div
          class="w-full py-2 border-b border-gray-content"
          v-for="(pkg, index) in packageList"
          :key="index">
          <div class="flex items-center gap-2 mb-2">
            <ScTag :type="pkg.fileType" size="sm" status="info">
              v {{ pkg.version }}
            </ScTag>

            <div class="flex-1">{{ pkg.title }}</div>
            <div class="text-gray-content flex-shrink-0 text-end">
              {{ pkg.createdAt }}
            </div>
          </div>

          <div class="flex gap-2 justify-end flex-wrap">
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
            <div class="flex gap-2 py-1 justify-end">
              <ScButton
                class="px-4"
                :icon="Download"
                :iconSize="18"
                @click="downloadFile(file.url, pkg.id)">
                {{ file.downloadCount }}
              </ScButton>
            </div>
          </div>
        </div>
      </div>
      <ScButton
        v-if="packageList.length"
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

  <ScModal v-model="isDeletePost">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">
        {{ $t('t.que-ren-shan-chu-tie-zi') }}
      </div>
      <div class="">
        {{ $t('t.tie-zi-biao-ti') }}
        <span>{{ posts[currenPostId].title }}</span>
      </div>
      <div class="mb-4">
        <span>{{ $t('d.ni-que-ding-yao-shan-chu-ci-tie-zi-ma') }}</span>
        <span class="text-error">{{ $t('d.ci-cao-zuo-wu-fa-che-hui') }}</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="isDeletePost = false">
          {{ $t('b.qu-xiao') }}
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePost">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="isDeletePkg">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">
        {{ $t('d.que-ding-shan-chu-ban-ben') }}
      </div>
      <div class="flex gap-2">
        {{ $t('b.ban-ben-hao') }}
        <ScTag
          :type="packageList[currenPkgId].fileType"
          size="sm"
          status="info">
          v {{ packageList[currenPkgId].version }}
        </ScTag>
      </div>
      <div class="">
        {{ $t('d.ban-ben-biao-ti') }}
        <span>{{ packageList[currenPkgId].title }}</span>
      </div>
      <div class="mb-4">
        <span>{{ $t('d.ni-que-ding-yao-shan-chu-ci-ban-ben-ma') }}</span>
        <span class="text-error">{{ $t('d.ci-cao-zuo-wu-fa-che-hui') }}</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="isDeletePkg = false">
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
import type { UserType } from '@/types'
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
import { userApi, postApi, downloadApi } from '@/apis'
import { formatTime, htmlToText } from '@/utils/format'
import type { Post } from '@/types/Post'
import { useToast } from 'vue-toastification'
import { extractImageSrcs } from '@/utils/regex'
import { useRouter } from 'vue-router'
import { iconMap, useTypeLabelMap } from '@/utils/fileType'
import type { DocumentVersion } from '@/types/DocumentVersion'
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

const { t } = useI18n()
const userStore = useUserStore()
const userInfo = ref<UserType>(userStore.userInfo)
const toast = useToast()
const typeLabelMap = useTypeLabelMap()

const currenPostId = ref(0)
const currenPkgId = ref(0)
const posts = ref<Post[]>([])
const packageList = ref<DocumentVersion[]>([])
const openPackageList = ref(false)
const isDeletePost = ref(false)
const isDeletePkg = ref(false)
const loading = ref(false)

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  count: 0,
})
const searchText = ref('')
const isSearch = ref(false)

const router = useRouter()

const getPosts = () => {
  if (!userStore.isLogin) {
    return
  }
  if (isSearch.value) {
    search(searchText.value, false)
    return
  }
  loading.value = true
  userApi
    .getUserPosts({
      userId: userInfo.value.id,
      type: 2,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    .then((response) => {
      posts.value = response.data.data.list.map((item: any) => {
        const imgs = extractImageSrcs(item.content)
        item.cover = imgs.length > 0 ? imgs[0] : ''
        item.createdAt = formatTime(item.createdAt)
        item.content = htmlToText(item.content)
        return item
      })
      pagination.value = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
        count: response.data.data.count,
      }
      loading.value = false
    })
    .catch((error) => {
      toast.error(t('t.jia-zai-shi-bai') + error.msg)
    })
}

const unpublishItem = (postIndex: number) => {
  const item = posts.value[postIndex]
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
        getPosts()
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

const onPackageModal = (id: number) => {
  currenPostId.value = id
  getPackageList()
  openPackageList.value = !openPackageList.value
}

const toCreateResource = () => {
  openPackageList.value = false
  router.push({
    name: 'publishResource',
    query: {
      postId: currenPostId.value,
    },
    params: {
      postId: currenPostId.value,
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
      postId: currenPostId.value,
    },
  })
}

const getPackageList = () => {
  postApi
    .getPostDocumentList({
      id: currenPostId.value,
    })
    .then((response) => {
      packageList.value = response.data.data.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
        return item
      })
    })
    .catch((error) => {
      console.error('Error fetching package list:', error)
    })
}

const downloadFile = (url: string, vid: number) => {
  if (!url) return
  let fileName = url.split('/').pop()
  if (!fileName) return
  fileName = fileName.replace(/(preview|download)\?filename=/, '')
  downloadApi.downloadFile(fileName, vid)
}

const deleteItem = (postIndex: number) => {
  isDeletePost.value = true
  currenPostId.value = postIndex
}
const deletePkg = (pkgId: number) => {
  isDeletePkg.value = true
  currenPkgId.value = pkgId
}

const deletePost = () => {
  const item = posts.value[currenPostId.value]
  if (!item) {
    toast.error(t('t.tie-zi-bu-cun-zai'))
    return
  }
  postApi
    .deletePost(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        toast.success(t('t.shan-chu-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
  isDeletePost.value = false
}

const deletePackage = () => {
  const item = packageList.value[currenPkgId.value]
  if (!item) {
    toast.error(t('t.ban-ben-bu-cun-zai'))
    return
  }
  postApi
    .deleteVersion(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新版本列表
        getPackageList()
        toast.success(t('t.shan-chu-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
  isDeletePkg.value = false
}

const toPage = (page: number) => {
  pagination.value.page = page
  getPosts()
}

const search = (key: string, click = true, fileTypes?: string) => {
  if (click) {
    pagination.value.page = 1
  }
  loading.value = true
  searchText.value = key.trim()
  isSearch.value = true

  const query: any = {
    userId: userInfo.value.id,
    type: 2,
    page: pagination.value.page,
    limit: pagination.value.limit,
  }

  if (searchText.value !== '') {
    query.key = searchText.value
  }

  if (fileTypes && fileTypes != '0') {
    console.log('fileTypes', fileTypes)

    query.fileTypes = fileTypes
  }

  userApi
    .getUserPosts(query)
    .then((response) => {
      posts.value = response.data.data.list.map((item: any) => {
        const imgs = extractImageSrcs(item.content)
        item.cover = imgs.length > 0 ? imgs[0] : ''
        item.createdAt = formatTime(item.createdAt)
        item.content = htmlToText(item.content)
        return item
      })
      pagination.value = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
        count: response.data.data.count,
      }
      loading.value = false
    })
    .catch((error) => {
      toast.error(t('t.sou-suo-shi-bai') + error.msg)
    })
}

onMounted(() => {
  getPosts()
})
</script>
