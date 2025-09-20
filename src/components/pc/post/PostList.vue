<template>
  <div class="w-full h-full flex flex-1 flex-col pb-4">
    <ScSearch
      key="user-post-search"
      :placeholder="$t('t.sou-suo-tie-zi-biao-ti')"
      @search="handleSearch"
      v-model="postStore.searchText"
      :searchType="route.name == 'postList' ? 1 : 2"
      class="m-1 mb-3" />

    <div v-if="postStore.post.length" class="flex flex-col flex-grow">
      <ul
        class="flex-grow overflow-y-auto no-scrollbar p-1 flex flex-col gap-4">
        <li v-for="post in postStore.post" :key="post.id">
          <ItemCard :post="post" />
        </li>
      </ul>
      <div class="flex-shrink-0 mt-2">
        <Pagination
          :current-page="postStore.postPage.page"
          :total-items="postStore.postPage.total"
          :page-size="postStore.postPage.limit"
          @page-change="setPage" />
      </div>
    </div>

    <EmptyState
      v-else
      class="w-full px-auto"
      :action="'前往发帖'"
      :actionIcon="SquareArrowOutUpRight"
      @action-click="$router.push({ name: 'publish' })" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from './ItemCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { SquareArrowOutUpRight } from 'lucide-vue-next'
import ScSearch from '@/components/pc/user/ScSearch.vue'
import { getPost, search } from '@/stores/module/post/service'
import { usePostStore } from '@/stores/module/post/postStore'

const route = useRoute()

const plateId = ref<string>(route.params.plateId as string)

const postStore = usePostStore()

const setPage = (page: number) => {
  postStore.postPage.page = page
  getPost(+plateId.value, route)
}

const handleSearch = (
  searchText: string,
  click: boolean,
  fileTypes: string
) => {
  postStore.searchText = searchText
  postStore.isSearch = true
  postStore.postPage.page = 1
  postStore.postPage.total = 0
  postStore.post = []
  search(searchText, click, fileTypes, route)
}

watch(
  () => route.params,
  (newPlate) => {
    if (newPlate.plateId) {
      plateId.value = newPlate.plateId as string
      postStore.postPage.page = 1
      postStore.postPage.limit = 10
      getPost(+newPlate.plateId, route)
    }
  }
)
onMounted(() => {
  getPost(+route.params.plateId, route)
})
</script>
