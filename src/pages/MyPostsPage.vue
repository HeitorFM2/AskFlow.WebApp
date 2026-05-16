<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <p class="page-section-title q-mb-md">
        <q-icon name="edit_note" color="accent" size="20px" class="q-mr-sm" />
        {{ $t("myPosts.title") }}
      </p>

      <PostSkeleton v-if="store.loading && !store.items.length" />

      <PostCard
        v-for="post in store.items"
        :key="post.id"
        :post="post"
        @open="openPost"
        @deleted="store.removeItem($event)"
      />

      <div v-if="store.pagination.hasNextPage" class="flex flex-center q-py-md">
        <q-btn
          outline
          color="accent"
          :label="$t('myPosts.loadMore')"
          :loading="store.loading"
          @click="store.loadMore()"
        />
      </div>

      <div
        v-if="!store.loading && !store.items.length"
        class="flex flex-center column q-py-xl"
        style="color: rgba(150, 170, 220, 0.4)"
      >
        <q-icon name="edit_note" size="56px" />
        <p class="q-mt-md text-body2">{{ $t("myPosts.empty") }}</p>
      </div>
    </div>

    <PostDetail
      v-model="detailOpen"
      :post-id="selectedPostId"
      @deleted="store.removeItem($event)"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPostsStore } from "src/stores/myPosts";
import PostCard from "src/components/PostCard.vue";
import PostDetail from "src/components/PostDetail.vue";
import PostSkeleton from "src/components/PostSkeleton.vue";

const store = useMyPostsStore();

const detailOpen = ref(false);
const selectedPostId = ref(null);

onMounted(() => store.fetchMyPosts());

function openPost(post) {
  selectedPostId.value = post.id;
  detailOpen.value = true;
}
</script>
