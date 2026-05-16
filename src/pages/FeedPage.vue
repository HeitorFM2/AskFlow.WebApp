<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <p class="page-section-title q-mb-md">
        <q-icon name="dynamic_feed" color="accent" size="20px" class="q-mr-sm" />
        {{ $t('feed.title') }}
      </p>

      <PostComposer class="q-mb-md" />

      <PostSkeleton v-if="postsStore.loading && !postsStore.items.length" :count="5" />

      <PostCard
        v-for="post in postsStore.items"
        :key="post.id"
        :post="post"
        @open="openPost"
      />

      <div v-if="postsStore.pagination.hasNextPage" class="flex flex-center q-py-md">
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
        style="color: rgba(150,170,220,0.4)"
      >
        <q-icon name="dynamic_feed" size="56px" />
        <p class="q-mt-md text-body2">{{ $t('feed.empty') }}</p>
      </div>
    </div>

    <PostDetail v-model="detailOpen" :post-id="selectedPostId" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePostsStore } from 'src/stores/posts'
import PostCard from 'src/components/PostCard.vue'
import PostComposer from 'src/components/PostComposer.vue'
import PostDetail from 'src/components/PostDetail.vue'
import PostSkeleton from 'src/components/PostSkeleton.vue'

const postsStore = usePostsStore()

const detailOpen = ref(false)
const selectedPostId = ref(null)

onMounted(() => postsStore.fetchFeed())

function openPost(post) {
  selectedPostId.value = post.id
  detailOpen.value = true
}
</script>
