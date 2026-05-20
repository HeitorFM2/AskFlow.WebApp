import { defineStore } from "pinia";
import { ref } from "vue";
import { PostsService } from "src/services/posts.service";

export const useUserPostsStore = defineStore("userPosts", () => {
  const items = ref([]);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const loading = ref(false);
  const profileUser = ref(null);
  const currentUserName = ref("");

  async function fetchPosts(userName, page = 1, pageSize = 20) {
    currentUserName.value = userName;
    loading.value = true;
    try {
      const result = await PostsService.getByUserName(userName, page, pageSize);
      if (page === 1) {
        items.value = result.items;
        if (result.items.length) profileUser.value = result.items[0].user;
      } else {
        items.value.push(...result.items);
      }
      pagination.value = {
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    } finally {
      loading.value = false;
    }
  }

  function loadMore() {
    if (pagination.value.hasNextPage) {
      fetchPosts(currentUserName.value, pagination.value.page + 1);
    }
  }

  function incrementComments(postId, delta = 1) {
    const post = items.value.find((p) => p.id === postId);
    if (post) post.comments += delta;
  }

  function reset() {
    items.value = [];
    profileUser.value = null;
    currentUserName.value = "";
  }

  return {
    items,
    pagination,
    loading,
    profileUser,
    fetchPosts,
    loadMore,
    reset,
    incrementComments,
  };
});
