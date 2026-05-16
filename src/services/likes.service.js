import { api } from 'src/boot/axios'

export const LikesService = {
  getLikedPosts: (page = 1, pageSize = 20) =>
    api
      .get('/api/v2/Likes/LikedPosts', { params: { page, pageSize } })
      .then((r) => r.data),

  toggle: (postId) =>
    api.post(`/api/v2/Likes/${postId}`).then((r) => r.data),
}
