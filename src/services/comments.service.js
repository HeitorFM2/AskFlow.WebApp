import { api } from 'src/boot/axios'

export const CommentsService = {
  getByPost: (postId, page = 1, pageSize = 20) =>
    api
      .get(`/api/v2/Comments/${postId}`, { params: { page, pageSize } })
      .then((r) => r.data),

  getReplies: (commentId, page = 1, pageSize = 20) =>
    api
      .get(`/api/v2/Comments/${commentId}/Replies`, { params: { page, pageSize } })
      .then((r) => r.data),

  create: (postId, payload) =>
    api.post(`/api/v2/Comments/${postId}`, payload).then((r) => r.data),

  delete: (commentId) =>
    api.delete(`/api/v2/Comments/${commentId}`).then((r) => r.data),
}
