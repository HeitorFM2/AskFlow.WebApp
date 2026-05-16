import { defineStore } from "pinia";
import { ref } from "vue";
import { CommentsService } from "src/services/comments.service";

export const useCommentsStore = defineStore("comments", () => {
  const byPost = ref({});
  const replies = ref({});
  const loading = ref(false);

  async function fetchByPost(postId, page = 1, pageSize = 20) {
    loading.value = true;
    try {
      const result = await CommentsService.getByPost(postId, page, pageSize);
      if (!byPost.value[postId] || page === 1) {
        byPost.value[postId] = result;
      } else {
        byPost.value[postId] = {
          ...result,
          items: [...byPost.value[postId].items, ...result.items],
        };
      }
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function fetchReplies(commentId, page = 1, pageSize = 20) {
    loading.value = true;
    try {
      const result = await CommentsService.getReplies(
        commentId,
        page,
        pageSize
      );
      if (!replies.value[commentId] || page === 1) {
        replies.value[commentId] = result;
      } else {
        replies.value[commentId] = {
          ...result,
          items: [...replies.value[commentId].items, ...result.items],
        };
      }
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function addComment(postId, content, parentCommentId = null) {
    await CommentsService.create(postId, { content, parentCommentId });
    await fetchByPost(postId, 1);
  }

  async function addReply(postId, commentId, content) {
    await CommentsService.create(postId, {
      content,
      parentCommentId: commentId,
    });
    await fetchReplies(commentId, 1);
    await fetchByPost(postId, 1);
  }

  async function removeComment(postId, commentId) {
    await CommentsService.delete(commentId);
    if (byPost.value[postId]) {
      byPost.value[postId].items = byPost.value[postId].items.filter(
        (c) => c.id !== commentId
      );
    }
  }

  function getPostComments(postId) {
    return (
      byPost.value[postId] || { items: [], totalCount: 0, hasNextPage: false }
    );
  }

  return {
    loading,
    fetchByPost,
    fetchReplies,
    addComment,
    addReply,
    removeComment,
    getPostComments,
  };
});
