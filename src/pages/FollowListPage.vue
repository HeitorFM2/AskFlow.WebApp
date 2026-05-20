<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <p class="page-section-title q-mb-md">
        <q-icon
          :name="isFollowers ? 'group' : 'person_add'"
          color="accent"
          size="20px"
          class="q-mr-sm"
        />
        {{
          isFollowers
            ? $t("follows.followersTitle")
            : $t("follows.followingTitle")
        }}
      </p>

      <!-- Search filter -->
      <q-input
        v-model="search"
        rounded
        standout
        dense
        clearable
        :placeholder="$t('follows.searchPlaceholder')"
        bg-color="primary"
        :input-style="{ color: 'white', fontSize: '0.9rem' }"
        label-color="grey-5"
        class="q-mb-md"
        @update:model-value="onSearchInput"
      >
        <template #prepend>
          <q-icon name="search" color="grey-5" size="18px" />
        </template>
      </q-input>

      <!-- Loading skeletons -->
      <div v-if="loading && !items.length">
        <div v-for="i in 5" :key="i" class="flex items-center q-pa-sm q-mb-xs">
          <q-skeleton type="QAvatar" size="44px" class="q-mr-md" />
          <div class="col">
            <q-skeleton type="text" width="38%" class="q-mb-xs" />
            <q-skeleton type="text" width="22%" />
          </div>
          <q-skeleton type="QBtn" width="72px" height="28px" />
        </div>
      </div>

      <!-- User list -->
      <div
        v-for="user in items"
        :key="user.id"
        class="follow-user-item q-mb-xs"
      >
        <div class="flex items-center q-pa-sm">
          <q-avatar
            size="44px"
            color="primary"
            text-color="white"
            class="q-mr-md cursor-pointer"
            @click="goToUser(user)"
          >
            <img
              v-if="user.avatarUrl"
              :src="user.avatarUrl"
              style="width: 100%; height: 100%; object-fit: cover"
            />
            <span v-else>{{
              user.identification?.[0]?.toUpperCase() || "?"
            }}</span>
          </q-avatar>

          <div class="col cursor-pointer" @click="goToUser(user)">
            <div
              class="text-white text-weight-medium"
              style="font-size: 0.93rem; line-height: 1.3"
            >
              {{ user.identification }}
            </div>
            <div style="font-size: 0.78rem; color: rgba(150, 170, 220, 0.55)">
              @{{ user.userName }}
            </div>
          </div>

          <q-btn
            v-if="!isCurrentUser(user)"
            :outline="!user.isFollowing"
            :unelevated="user.isFollowing"
            color="accent"
            :label="
              user.isFollowing ? $t('follows.following') : $t('follows.follow')
            "
            dense
            size="sm"
            class="q-px-sm"
            :loading="loadingUserId === user.id"
            @click="onToggleFollow(user)"
          />
        </div>
      </div>

      <!-- Load more -->
      <div v-if="pagination.hasNextPage" class="flex flex-center q-py-md">
        <q-btn
          outline
          color="accent"
          :label="$t('follows.loadMore')"
          :loading="loading"
          @click="loadMore"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="!loading && !items.length"
        class="flex flex-center column q-py-xl"
        style="color: rgba(150, 170, 220, 0.4)"
      >
        <q-icon :name="isFollowers ? 'group' : 'person_add'" size="56px" />
        <p class="q-mt-md text-body2">
          {{
            isFollowers
              ? $t("follows.emptyFollowers")
              : $t("follows.emptyFollowing")
          }}
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useFollowsStore } from "src/stores/follows";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

function goToUser(user) {
  if (user?.userName)
    router.push({
      name: "user-posts",
      params: { userName: user.userName },
      state: { profileUser: JSON.stringify(user) },
    });
}
const followsStore = useFollowsStore();

const loadingUserId = ref(null);
const search = ref("");
let debounceTimer = null;

const isFollowers = computed(() => route.name === "followers");
const items = computed(() =>
  isFollowers.value ? followsStore.followers : followsStore.following
);
const pagination = computed(() =>
  isFollowers.value
    ? followsStore.followersPagination
    : followsStore.followingPagination
);
const loading = computed(() =>
  isFollowers.value
    ? followsStore.followersLoading
    : followsStore.followingLoading
);

onMounted(() => fetchList());
watch(
  () => route.name,
  () => {
    search.value = "";
    fetchList();
  }
);

function fetchList() {
  if (isFollowers.value) followsStore.fetchFollowers(1, 20, search.value);
  else followsStore.fetchFollowing(1, 20, search.value);
}

function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchList(), 350);
}

function isCurrentUser(user) {
  return user.userName === authStore.user?.userName;
}

async function onToggleFollow(user) {
  loadingUserId.value = user.id;
  try {
    await followsStore.toggleFollow(user.id, user.userName, user.isFollowing);
  } finally {
    loadingUserId.value = null;
  }
}

function loadMore() {
  if (isFollowers.value) followsStore.loadMoreFollowers();
  else followsStore.loadMoreFollowing();
}
</script>

<style scoped>
.follow-user-item {
  border-radius: 10px;
  transition: background 0.15s;
}
.follow-user-item:hover {
  background: rgba(79, 134, 247, 0.06);
}
</style>
