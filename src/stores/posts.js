import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PostsService } from 'src/services/posts.service'
import { LikesService } from 'src/services/likes.service'

export const usePostsStore = defineStore('posts', () => {
  const items = ref([])
  const pagination = ref({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const loading = ref(false)
  const currentPost = ref(null)

  async function fetchFeed(page = 1, pageSize = 20) {
    loading.value = true
    try {
      const result = await PostsService.getAll(page, pageSize)
      if (page === 1) items.value = result.items
      else items.value.push(...result.items)
      pagination.value = {
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchPost(postId) {
    loading.value = true
    try {
      currentPost.value = await PostsService.getById(postId)
    } finally {
      loading.value = false
    }
  }

  async function createPost(content) {
    await PostsService.create({ content })
    await fetchFeed(1)
  }

  async function deletePost(postId) {
    await PostsService.delete(postId)
    items.value = items.value.filter((p) => p.id !== postId)
    if (currentPost.value?.id === postId) currentPost.value = null
  }

  async function toggleLike(postId) {
    const post = items.value.find((p) => p.id === postId)
    if (!post) return

    const wasLiked = post.isLiked
    post.isLiked = !wasLiked
    post.likes += wasLiked ? -1 : 1

    try {
      await LikesService.toggle(postId)
    } catch {
      post.isLiked = wasLiked
      post.likes += wasLiked ? 1 : -1
    }
  }

  function loadMore() {
    if (pagination.value.hasNextPage) {
      fetchFeed(pagination.value.page + 1, pagination.value.pageSize)
    }
  }

  return {
    items,
    pagination,
    loading,
    currentPost,
    fetchFeed,
    fetchPost,
    createPost,
    deletePost,
    toggleLike,
    loadMore,
  }
})
