import { defineStore } from "pinia";
import { ref } from "vue";
import { PostsService } from "src/services/posts.service";

export const useFollowingPostsStore = defineStore("followingPosts", () => {
  const items = ref([]);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
  });
  const loading = ref(false);

  async function fetchPosts(page = 1, pageSize = 20) {
    loading.value = true;
    try {
      const result = await PostsService.getFollowing(page, pageSize);
      if (page === 1) items.value = result.items;
      else items.value.push(...result.items);
      pagination.value = {
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
      };
    } finally {
      loading.value = false;
    }
  }

  function loadMore() {
    if (pagination.value.hasNextPage && !loading.value) {
      fetchPosts(pagination.value.page + 1, pagination.value.pageSize);
    }
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  return { items, pagination, loading, fetchPosts, loadMore, removeItem };
});
