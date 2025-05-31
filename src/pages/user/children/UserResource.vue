<template>
  <Card
    v-for="(post, postIndex) in posts"
    :key="post.id"
    class="stats max-w-5xl min-w-4xl w-full">
    <div class="flex justify-center items-center">
      <!-- 左侧封面图 -->
      <div class="relative w-40 h-24 flex-shrink-0">
        <ScImage
          :src="post.cover"
          alt="封面图"
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
          class="flex items-center gap-2"
          @click.stop="
            router.push({ name: 'postDetails', params: { postId: post.id } })
          ">
          {{ post.title }}
          <ScTag size="sm">
            {{ typeLabelMap[post.fileType as keyof typeof typeLabelMap] }}
          </ScTag>
          <ScTag
            size="sm"
            :bgColor="
              post.visible == 1 ? 'var(--color-green)' : 'var(--color-error)'
            ">
            {{ post.visible == 1 ? '正常' : '下架' }}
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
          disabled>
          编辑
        </ScButton>
        <ScButton
          class="text-sm px-4 border border-gray hover:border-active"
          :icon="iconMap[post.fileType as keyof typeof iconMap]"
          :iconSize="16"
          @click="onPackageModal(post.id)">
          版本
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
          删除
        </ScButton>
      </div>
    </div>
  </Card>

  <EmptyState
    v-if="posts.length === 0"
    title="暂无帖子"
    description="你还没有发布任何帖子哦~"
    iconSize="64"
    iconColor="#ccc"
    :icon="Package"
    class="mt-8"
    action="前往发帖"
    :actionIcon="SquareArrowOutUpRight"
    @action-click="$router.push({ name: 'publish' })" />

  <ScModal v-model="openPackageList">
    <Card class="gap-4 w-4xl h-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">帖子版本列表</h3>
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
        <!-- 表头 -->
        <div class="flex font-semibold py-2 px-4 border-b border-gray-content">
          <div class="flex-1">版本</div>
          <div class="flex-[1.2]">标题</div>
          <div class="flex-1">文件数</div>
          <div class="flex-1">创建时间</div>
          <div class="flex-[1.1]">操作</div>
        </div>

        <!-- 表格行 -->
        <div
          class="w-full py-2 px-4 border-b border-gray-content"
          v-for="(pkg, index) in packageList"
          :key="index">
          <div class="flex items-center mb-2">
            <div class="flex-1 flex">
              <ScTag :type="pkg.fileType" size="sm">
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
                @click="toCreateResource()"
                disabled>
                编辑
              </ScButton>

              <ScButton
                class="text-sm text-error px-4 border hover:border-active"
                :icon="Trash2"
                :iconSize="16"
                @click="deletePkg(index)">
                删除
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
            <div class="flex-1">下载次数: {{ file.downloadCount }}</div>
            <div class="flex-[1.1] flex gap-2 py-1 justify-end">
              <ScButton
                class="text-sm px-4 border hover:border-active"
                :icon="Download"
                :iconSize="16"
                noPd
                @click="downloadFile(file.url, pkg.id)">
                下载
              </ScButton>
              <ScButton
                class="text-sm text-error px-4 border hover:border-active"
                :icon="Trash2"
                :iconSize="16"
                noPd
                disabled>
                删除
              </ScButton>
            </div>
          </div>
        </div>
      </div>
      <ScButton
        v-if="packageList.length"
        class="w-full text-sm"
        @click="toCreateResource()"
        :icon="PackagePlus"
        iconSize="20"
        noBg
        Border>
        添加新版本
      </ScButton>
    </Card>
  </ScModal>

  <ScModal v-model="isDeletePost">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">确认删除帖子</div>
      <div class="">帖子标题: {{ posts[currenPostId].title }}</div>
      <div class="mb-4">
        <span>你确定要删除此帖子吗?</span>
        <span class="text-error">此操作无法撤回</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="isDeletePost = false">
          取消
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePost">
          确认删除
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="isDeletePkg">
    <Card class="max-w-2xl">
      <div class="text-lg font-bold mb-4">确认删除版本</div>
      <div class="flex gap-2">
        版本号:
        <ScTag :type="packageList[currenPkgId].fileType" size="sm">
          v {{ packageList[currenPkgId].version }}
        </ScTag>
      </div>
      <div class="">版本标题: {{ packageList[currenPkgId].title }}</div>
      <div class="mb-4">
        <span>你确定要删除此版本吗?</span>
        <span class="text-error">此操作无法撤回</span>
      </div>
      <ScDivider />
      <div class="flex justify-end gap-2">
        <ScButton class="text-sm border" @click="isDeletePkg = false">
          取消
        </ScButton>
        <ScButton class="text-sm text-error border" @click="deletePackage">
          确认删除
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { useUserStore } from '@/stores/userStore'
import type { UserType } from '@/types'
import { onMounted, ref } from 'vue'
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  CornerDownRight,
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  MessageSquare,
  Server,
  Flame,
  PackagePlus,
  Trash2,
  Minimize2,
  Eye,
  SquarePen,
  Delete,
  Download,
  SquareArrowOutUpRight,
} from 'lucide-vue-next'
import { userApi, postApi, downloadApi } from '@/apis'
import { formatTime } from '@/hook/format'
import ScImage from '@/components/ScImage.vue'
import ScButton from '@/components/ScButton.vue'
import ScModal from '@/components/ScModal.vue'
import type { Post } from '@/types/Post'
import { useToast } from 'vue-toastification'
import { extractImageSrcs } from '@/hook/regex'
import EmptyState from '@/components/EmptyState.vue'
import { useRouter } from 'vue-router'
import { iconMap, typeLabelMap } from '@/hook/fileType'
import ScTag from '@/components/ScTag.vue'
import type { DocumentVersion } from '@/types/DocumentVersion'

import { formatFileSize } from '@/hook/format'
import ScTable from '@/components/ScTable.vue'

const userStore = useUserStore()
const userInfo = ref<UserType>(userStore.userInfo)
const toast = useToast()

const currenPostId = ref(0)
const currenPkgId = ref(0)
const posts = ref<Post[]>([])
const packageList = ref<DocumentVersion[]>([])
const openPackageList = ref(false)
const isDeletePost = ref(false)
const isDeletePkg = ref(false)

const router = useRouter()

const getPosts = () => {
  userApi
    .getUserPosts({
      userId: userInfo.value.id,
      type: 2,
    })
    .then((response) => {
      posts.value = response.data.data.list.map((item: any) => {
        //
        const imgs = extractImageSrcs(item.content)
        item.cover = imgs.length > 0 ? imgs[0] : ''
        item.createdAt = formatTime(item.createdAt)
        return item
      })
    })
    .catch((error) => {
      console.error('Error fetching posts:', error)
    })
}

const unpublishItem = (postIndex: number) => {
  const item = posts.value[postIndex]
  if (!item) {
    toast.error('帖子不存在')
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
        toast.success('操作成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
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
  const fileName = url.split('/').pop()
  if (!fileName) return
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
    toast.error('帖子不存在')
    return
  }
  postApi
    .deletePost(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        toast.success('删除成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
  isDeletePost.value = false
}

const deletePackage = () => {
  const item = packageList.value[currenPkgId.value]
  if (!item) {
    toast.error('版本不存在')
    return
  }
  postApi
    .deleteVersion(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新版本列表
        getPackageList()
        toast.success('删除成功')
      }
    })
    .catch((error) => {
      toast.error('请求失败: ' + error.msg)
    })
  isDeletePkg.value = false
}

onMounted(() => {
  getPosts()
})
</script>
