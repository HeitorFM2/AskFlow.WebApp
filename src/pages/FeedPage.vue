<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <p class="page-section-title q-mb-md">
        <q-icon
          name="dynamic_feed"
          color="accent"
          size="20px"
          class="q-mr-sm"
        />
        {{ $t("feed.title") }}
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
              @click="goToUser(user.userName)"
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

            <div class="col cursor-pointer" @click="goToUser(user.userName)">
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

      <!-- Feed normal -->
      <template v-else>
        <PostComposer class="q-mb-md" />

        <PostSkeleton
          v-if="postsStore.loading && !postsStore.items.length"
          :count="5"
        />

        <PostCard
          v-for="post in postsStore.items"
          :key="post.id"
          :post="post"
          @open="openPost"
        />

        <div
          v-if="postsStore.pagination.hasNextPage"
          class="flex flex-center q-py-md"
        >
          <q-btn
            outline
            color="accent"
            :label="$t('feed.loadMore')"
            :loading="postsStore.loading"
            @click="postsStore.loadMore()"
          />
        </div>

        <div
          v-if="!postsStore.loading && !postsStore.items.length"
          class="flex flex-center column q-py-xl"
          style="color: rgba(150, 170, 220, 0.4)"
        >
          <q-icon name="dynamic_feed" size="56px" />
          <p class="q-mt-md text-body2">{{ $t("feed.empty") }}</p>
        </div>
      </template>
    </div>

    <PostDetail v-model="detailOpen" :post-id="selectedPostId" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePostsStore } from "src/stores/posts";
import { useFollowsStore } from "src/stores/follows";
import { useAuthStore } from "src/stores/auth";
import PostCard from "src/components/PostCard.vue";
import PostComposer from "src/components/PostComposer.vue";
import PostDetail from "src/components/PostDetail.vue";
import PostSkeleton from "src/components/PostSkeleton.vue";

const router = useRouter();
const postsStore = usePostsStore();
const followsStore = useFollowsStore();
const authStore = useAuthStore();

function goToUser(userName) {
  if (userName) router.push({ name: "user-posts", params: { userName } });
}

const detailOpen = ref(false);
const selectedPostId = ref(null);
const search = ref("");
const loadingUserId = ref(null);
let debounceTimer = null;

onMounted(() => postsStore.fetchFeed());

function openPost(post) {
  selectedPostId.value = post.id;
  detailOpen.value = true;
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
