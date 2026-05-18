import { api } from "src/boot/axios";

export const FollowsService = {
  follow: (targetUserName) =>
    api.post("/api/v2/Follows", { targetUserName }).then((r) => r.data),

  getStats: () => api.get("/api/v2/Follows/Stats").then((r) => r.data),

  getFollowers: (page = 1, pageSize = 20, search = "") =>
    api
      .get("/api/v2/Follows/Followers", {
        params: { page, pageSize, ...(search ? { search } : {}) },
      })
      .then((r) => r.data),

  getFollowing: (page = 1, pageSize = 20, search = "") =>
    api
      .get("/api/v2/Follows/Following", {
        params: { page, pageSize, ...(search ? { search } : {}) },
      })
      .then((r) => r.data),
};
