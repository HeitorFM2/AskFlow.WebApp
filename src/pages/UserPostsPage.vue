<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <!-- Back -->
      <q-btn
        flat
        dense
        icon="arrow_back"
        color="accent"
        class="q-mb-md"
        @click="$router.back()"
      />

      <!-- User header skeleton -->
      <div
        v-if="store.loading && !store.profileUser"
        class="flex items-center q-mb-lg q-px-sm"
      >
        <q-skeleton type="QAvatar" size="56px" class="q-mr-md" />
        <div class="col">
          <q-skeleton type="text" width="40%" class="q-mb-xs" />
          <q-skeleton type="text" width="25%" />
        </div>
      </div>

      <!-- User header -->
      <div
        v-else-if="store.profileUser"
        class="flex items-center q-mb-lg q-px-sm"
      >
        <q-avatar
          size="56px"
          color="primary"
          text-color="white"
          class="q-mr-md"
        >
          <img
            v-if="store.profileUser.avatarUrl"
            :src="store.profileUser.avatarUrl"
            style="width: 100%; height: 100%; object-fit: cover"
          />
          <span v-else style="font-size: 1.3rem">
            {{ store.profileUser.identification?.[0]?.toUpperCase() || "?" }}
          </span>
        </q-avatar>
        <div class="col">
          <div class="text-white text-weight-bold" style="font-size: 1rem">
            {{ store.profileUser.identification }}
          </div>
          <div style="font-size: 0.8rem; color: rgba(150, 170, 220, 0.55)">
            @{{ store.profileUser.userName }}
          </div>
        </div>
        <q-btn
          v-if="!isOwnProfile"
          :outline="!localIsFollowing"
          :unelevated="localIsFollowing"
          color="accent"
          :label="
            localIsFollowing ? $t('follows.following') : $t('follows.follow')
          "
          size="md"
          class="q-px-lg"
          style="font-weight: 600; border-radius: 20px"
          :loading="followLoading || checkingFollow"
          @click="onToggleFollow"
        />
      </div>

      <q-separator
        style="background: rgba(79, 134, 247, 0.1)"
        class="q-mb-md"
      />

      <!-- Post skeletons -->
      <PostSkeleton v-if="store.loading && !store.items.length" />

      <!-- Posts -->
      <PostCard
        v-for="post in store.items"
        :key="post.id"
        :post="post"
        hide-follow
        @open="openPost"
      />

      <!-- Load more -->
      <div v-if="store.pagination.hasNextPage" class="flex flex-center q-py-md">
        <q-btn
          outline
          color="accent"
          :label="$t('userPosts.loadMore')"
          :loading="store.loading"
          @click="store.loadMore()"
        />
      </div>

      <!-- Empty -->
      <div
        v-if="!store.loading && !store.items.length"
        class="flex flex-center column q-py-xl"
        style="color: rgba(150, 170, 220, 0.4)"
      >
        <q-icon name="edit_note" size="56px" />
        <p class="q-mt-md text-body2">{{ $t("userPosts.empty") }}</p>
      </div>
    </div>

    <PostDetail v-model="detailOpen" :post-id="selectedPostId" />
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useFollowsStore } from "src/stores/follows";
import { useUserPostsStore } from "src/stores/userPosts";
import { FollowsService } from "src/services/follows.service";
import PostCard from "src/components/PostCard.vue";
import PostDetail from "src/components/PostDetail.vue";
import PostSkeleton from "src/components/PostSkeleton.vue";

const route = useRoute();
const authStore = useAuthStore();
const followsStore = useFollowsStore();
const store = useUserPostsStore();

const detailOpen = ref(false);
const selectedPostId = ref(null);
const localIsFollowing = ref(false);
const followLoading = ref(false);
const checkingFollow = ref(false);

const isOwnProfile = computed(
  () => route.params.userName === authStore.user?.userName
);

async function checkIsFollowing(userName) {
  if (isOwnProfile.value || !userName) return;
  checkingFollow.value = true;
  try {
    localIsFollowing.value = await FollowsService.isFollowing(userName);
  } finally {
    checkingFollow.value = false;
  }
}

watch(
  () => route.params.userName,
  (userName) => {
    if (userName) {
      store.reset();
      store.fetchPosts(userName);
      checkIsFollowing(userName);
    }
  }
);

onMounted(() => {
  store.reset();
  const stateUser = history.state?.profileUser;
  if (stateUser) store.profileUser = JSON.parse(stateUser);
  store.fetchPosts(route.params.userName);
  checkIsFollowing(route.params.userName);
});

function openPost(post) {
  selectedPostId.value = post.id;
  detailOpen.value = true;
}

async function onToggleFollow() {
  if (!store.profileUser) return;
  const prev = localIsFollowing.value;
  localIsFollowing.value = !prev;
  followLoading.value = true;
  try {
    await followsStore.toggleFollow(
      store.profileUser.id,
      store.profileUser.userName,
      prev
    );
  } catch (_) {
    localIsFollowing.value = prev;
  } finally {
    followLoading.value = false;
  }
}
</script>
