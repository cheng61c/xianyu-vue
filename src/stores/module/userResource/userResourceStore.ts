import type { DocumentVersion } from '@/types/DocumentVersion'
import type { Post } from '@/types/Post'
import { defineStore } from 'pinia'

export const useUserResourceStore = defineStore('userResource', {
  state: () => ({
    currenPkgId: 0,
    currenPostId: 0,
    packageList: [] as DocumentVersion[],
    posts: [] as Post[],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      count: 0,
    },

    searchText: '',

    loading: false,
    isDeletePkg: false,
    isDeletePost: false,
    isSearch: false,
  }),
  actions: {},
  persist: true,
})
