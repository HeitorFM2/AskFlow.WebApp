<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <p class="page-section-title q-mb-md">
        <q-icon name="group" color="accent" size="20px" class="q-mr-sm" />
        {{ $t("followingFeed.title") }}
      </p>

      <!-- User search -->
      <q-input
        v-model="search"
        rounded
        standout
        dense
        clearable
        :placeholder="$t('feed.searchUsers')"
        bg-color="primary"
        :input-style="{ color: 'white', fontSize: '0.9rem' }"
        label-color="grey-5"
        class="q-mb-md"
        @update:model-value="onSearchInput"
        @clear="onClear"
      >
        <template #prepend>
          <q-icon name="search" color="grey-5" size="18px" />
        </template>
      </q-input>

      <!-- User search results -->
      <template v-if="search">
        <div
          v-if="
            followsStore.userResultsLoading && !followsStore.userResults.length
          "
        >
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center q-pa-sm q-mb-xs"
          >
            <q-skeleton type="QAvatar" size="44px" class="q-mr-md" />
            <div class="col">
              <q-skeleton type="text" width="38%" class="q-mb-xs" />
              <q-skeleton type="text" width="22%" />
            </div>
            <q-skeleton type="QBtn" width="72px" height="28px" />
          </div>
        </div>

        <div
          v-for="user in followsStore.userResults"
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
              v-if="user.userName !== authStore.user?.userName"
              :outline="!user.isFollowing"
              :unelevated="user.isFollowing"
              color="accent"
              :label="
                user.isFollowing
                  ? $t('follows.following')
                  : $t('follows.follow')
              "
              dense
              size="sm"
              class="q-px-sm"
              :loading="loadingUserId === user.id"
              @click="onToggleFollow(user)"
            />
          </div>
        </div>

        <div
          v-if="
            !followsStore.userResultsLoading && !followsStore.userResults.length
          "
          class="flex flex-center column q-py-xl"
          style="color: rgba(150, 170, 220, 0.4)"
        >
          <q-icon name="person_search" size="56px" />
          <p class="q-mt-md text-body2">{{ $t("feed.noUsersFound") }}</p>
        </div>
      </template>

      <!-- Following feed -->
      <template v-else>
        <PostSkeleton v-if="store.loading && !store.items.length" />

        <PostCard
          v-for="post in store.items"
          :key="post.id"
          :post="post"
          @open="openPost"
          @deleted="store.removeItem($event)"
        />

        <div
          v-if="store.pagination.hasNextPage"
          class="flex flex-center q-py-md"
        >
          <q-btn
            outline
            color="accent"
            :label="$t('followingFeed.loadMore')"
            :loading="store.loading"
            @click="store.loadMore()"
          />
        </div>

        <div
          v-if="!store.loading && !store.items.length"
          class="flex flex-center column q-py-xl"
          style="color: rgba(150, 170, 220, 0.4)"
        >
          <q-icon name="group" size="56px" />
          <p class="q-mt-md text-body2">{{ $t("followingFeed.empty") }}</p>
        </div>
      </template>
    </div>

    <PostDetail
      v-model="detailOpen"
      :post-id="selectedPostId"
      @deleted="store.removeItem($event)"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useFollowingPostsStore } from "src/stores/followingPosts";
import { useFollowsStore } from "src/stores/follows";
import { useAuthStore } from "src/stores/auth";
import PostCard from "src/components/PostCard.vue";
import PostDetail from "src/components/PostDetail.vue";
import PostSkeleton from "src/components/PostSkeleton.vue";

const router = useRouter();
const store = useFollowingPostsStore();
const followsStore = useFollowsStore();
const authStore = useAuthStore();

const detailOpen = ref(false);
const selectedPostId = ref(null);
const search = ref("");
const loadingUserId = ref(null);
let debounceTimer = null;

onMounted(() => store.fetchPosts());
onUnmounted(() => clearTimeout(debounceTimer));

function openPost(post) {
  selectedPostId.value = post.id;
  detailOpen.value = true;
}

function goToUser(user) {
  if (user?.userName)
    router.push({
      name: "user-posts",
      params: { userName: user.userName },
      state: { profileUser: JSON.stringify(user) },
    });
}

function onSearchInput() {
  clearTimeout(debounceTimer);
  if (!search.value) return;
  debounceTimer = setTimeout(
    () => followsStore.fetchUserResults(search.value),
    350
  );
}

function onClear() {
  followsStore.userResults = [];
}

async function onToggleFollow(user) {
  loadingUserId.value = user.id;
  try {
    await followsStore.toggleFollow(user.id, user.userName, user.isFollowing);
  } finally {
    loadingUserId.value = null;
  }
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
