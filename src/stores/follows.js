import { defineStore } from "pinia";
import { ref } from "vue";
import { FollowsService } from "src/services/follows.service";
import { UsersService } from "src/services/users.service";

const emptyPagination = () => ({
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

function applyPagination(target, result) {
  target.page = result.page;
  target.pageSize = result.pageSize;
  target.totalCount = result.totalCount;
  target.totalPages = result.totalPages;
  target.hasNextPage = result.hasNextPage;
  target.hasPreviousPage = result.hasPreviousPage;
}

export const useFollowsStore = defineStore("follows", () => {
  const followers = ref([]);
  const followersPagination = ref(emptyPagination());
  const followersLoading = ref(false);
  const followersSearch = ref("");

  const following = ref([]);
  const followingPagination = ref(emptyPagination());
  const followingLoading = ref(false);
  const followingSearch = ref("");

  const counts = ref({ followers: 0, following: 0 });

  const userResults = ref([]);
  const userResultsLoading = ref(false);

  async function fetchFollowers(page = 1, pageSize = 20, search = followersSearch.value) {
    followersSearch.value = search;
    followersLoading.value = true;
    try {
      const result = await FollowsService.getFollowers(page, pageSize, search);
      if (page === 1) followers.value = result.items;
      else followers.value.push(...result.items);
      applyPagination(followersPagination.value, result);
      counts.value.followers = result.totalCount;
    } finally {
      followersLoading.value = false;
    }
  }

  async function fetchFollowing(page = 1, pageSize = 20, search = followingSearch.value) {
    followingSearch.value = search;
    followingLoading.value = true;
    try {
      const result = await FollowsService.getFollowing(page, pageSize, search);
      if (page === 1) following.value = result.items;
      else following.value.push(...result.items);
      applyPagination(followingPagination.value, result);
      counts.value.following = result.totalCount;
    } finally {
      followingLoading.value = false;
    }
  }

  async function fetchUserResults(search = "") {
    userResultsLoading.value = true;
    try {
      userResults.value = await UsersService.getAll(search);
    } finally {
      userResultsLoading.value = false;
    }
  }

  async function loadCounts() {
    const stats = await FollowsService.getStats();
    counts.value = {
      followers: stats.followers,
      following: stats.following,
    };
  }

  async function toggleFollow(userId, targetUserName, wasFollowing) {
    const inFollowers = followers.value.find((u) => u.id === userId);
    const inFollowing = following.value.find((u) => u.id === userId);
    const inResults = userResults.value.find((u) => u.id === userId);

    const prevF = inFollowers?.isFollowing ?? null;
    const prevG = inFollowing?.isFollowing ?? null;
    const prevR = inResults?.isFollowing ?? null;

    if (inFollowers) inFollowers.isFollowing = !inFollowers.isFollowing;
    if (inFollowing) inFollowing.isFollowing = !inFollowing.isFollowing;
    if (inResults) inResults.isFollowing = !inResults.isFollowing;

    counts.value.following += wasFollowing ? -1 : 1;

    try {
      await FollowsService.follow(targetUserName);
    } catch (_) {
      if (inFollowers && prevF !== null) inFollowers.isFollowing = prevF;
      if (inFollowing && prevG !== null) inFollowing.isFollowing = prevG;
      if (inResults && prevR !== null) inResults.isFollowing = prevR;
      counts.value.following += wasFollowing ? 1 : -1;
    }
  }

  function loadMoreFollowers() {
    if (followersPagination.value.hasNextPage) {
      fetchFollowers(
        followersPagination.value.page + 1,
        followersPagination.value.pageSize
      );
    }
  }

  function loadMoreFollowing() {
    if (followingPagination.value.hasNextPage) {
      fetchFollowing(
        followingPagination.value.page + 1,
        followingPagination.value.pageSize
      );
    }
  }

  return {
    followers,
    followersPagination,
    followersLoading,
    following,
    followingPagination,
    followingLoading,
    counts,
    fetchFollowers,
    fetchFollowing,
    loadCounts,
    toggleFollow,
    loadMoreFollowers,
    loadMoreFollowing,
    userResults,
    userResultsLoading,
    fetchUserResults,
  };
});
