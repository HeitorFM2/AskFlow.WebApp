<template>
  <q-page class="q-pa-md">
    <div class="feed-container">
      <p class="page-section-title q-mb-md">
        <q-icon name="favorite" color="negative" size="20px" class="q-mr-sm" />
        {{ $t('liked.title') }}
      </p>

      <PostSkeleton v-if="likesStore.loading && !likesStore.items.length" />

      <PostCard
        v-for="item in likesStore.items"
        :key="item.id"
        :post="item"
        @open="openPost"
        @deleted="likesStore.removeItem($event)"
        @unliked="likesStore.removeItem($event)"
      />

      <div v-if="likesStore.pagination.hasNextPage" class="flex flex-center q-py-md">
        <q-btn
          outline
          color="accent"
          :label="$t('liked.loadMore')"
          :loading="likesStore.loading"
          @click="likesStore.loadMore()"
        />
      </div>

      <div
        v-if="!likesStore.loading && !likesStore.items.length"
        class="flex flex-center column q-py-xl"
        style="color: rgba(150,170,220,0.4)"
      >
        <q-icon name="favorite_border" size="56px" />
        <p class="q-mt-md text-body2">{{ $t('liked.empty') }}</p>
      </div>
    </div>

    <PostDetail v-model="detailOpen" :post-id="selectedPostId" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLikesStore } from 'src/stores/likes'
import PostCard from 'src/components/PostCard.vue'
import PostDetail from 'src/components/PostDetail.vue'
import PostSkeleton from 'src/components/PostSkeleton.vue'

const likesStore = useLikesStore()

const detailOpen = ref(false)
const selectedPostId = ref(null)

onMounted(() => likesStore.fetchLikedPosts())

function openPost(post) {
  selectedPostId.value = post.id
  detailOpen.value = true
}
</script>
