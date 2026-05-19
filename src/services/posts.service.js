import { api } from "src/boot/axios";

export const PostsService = {
  getAll: (page = 1, pageSize = 20) =>
    api
      .get("/api/v2/Posts", { params: { page, pageSize } })
      .then((r) => r.data),

  getById: (postId) =>
    api.get(`/api/v2/Posts/${postId}/Details`).then((r) => r.data),

  create: (payload) => api.post("/api/v2/Posts", payload).then((r) => r.data),

  delete: (postId) => api.delete(`/api/v2/Posts/${postId}`).then((r) => r.data),

  getMe: (page = 1, pageSize = 20) =>
    api
      .get("/api/v2/Posts/Me", { params: { page, pageSize } })
      .then((r) => r.data),

  getByUserName: (targetUserName, page = 1, pageSize = 20) =>
    api
      .post("/api/v2/Posts/ByUserName", { targetUserName }, { params: { page, pageSize } })
      .then((r) => r.data),
};
