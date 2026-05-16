import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LikesService } from 'src/services/likes.service'

export const useLikesStore = defineStore('likes', () => {
  const items = ref([])
  const pagination = ref({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
  })
  const loading = ref(false)

  async function fetchLikedPosts(page = 1, pageSize = 20) {
    loading.value = true
    try {
      const result = await LikesService.getLikedPosts(page, pageSize)
      if (page === 1) items.value = result.items
      else items.value.push(...result.items)
      pagination.value = {
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
      }
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    if (pagination.value.hasNextPage) {
      fetchLikedPosts(pagination.value.page + 1, pagination.value.pageSize)
    }
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  return { items, pagination, loading, fetchLikedPosts, loadMore, removeItem }
})
