<template>
  <div>
    <!-- Composer -->
    <div class="tw-composer q-mb-md">
      <div
        class="tw-thread-col"
        style="
          width: 36px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
        "
      >
        <q-avatar
          size="36px"
          color="primary"
          text-color="white"
          style="font-size: 13px"
        >
          <img
            v-if="currentUser?.avatarUrl"
            :src="currentUser.avatarUrl"
            style="width: 100%; height: 100%; object-fit: cover"
          />
          <span v-else>{{
            currentUser?.identification?.[0]?.toUpperCase() || "?"
          }}</span>
        </q-avatar>
      </div>
      <div style="flex: 1; min-width: 0">
        <q-input
          v-model="newComment"
          dense
          borderless
          :placeholder="$t('comments.placeholder')"
          :maxlength="500"
          :input-style="{ color: '#dde4f0', fontSize: '0.88rem' }"
          @keyup.enter="submitComment"
        >
          <template #append>
            <q-btn
              flat
              dense
              round
              icon="send"
              color="accent"
              size="sm"
              :loading="posting"
              :disable="!newComment.trim()"
              @click="submitComment"
            />
          </template>
        </q-input>
        <div
          style="
            height: 1px;
            background: rgba(79, 134, 247, 0.18);
            margin-top: 2px;
          "
        />
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && !comments.length">
      <q-skeleton v-for="i in 3" :key="i" type="text" class="q-mb-sm" />
    </div>

    <!-- Empty state -->
    <p
      v-if="!loading && !comments.length"
      class="text-center q-py-lg"
      style="color: rgba(150, 170, 220, 0.4); font-size: 0.88rem"
    >
      {{ $t("comments.empty") }}
    </p>

    <!-- Comments -->
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :post-id="postId"
      @deleted="reload"
    />

    <!-- Load more -->
    <div v-if="hasNextPage" class="flex flex-center q-pt-sm">
      <q-btn
        flat
        dense
        color="accent"
        :label="$t('comments.loadMore')"
        :loading="loading"
        size="sm"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useCommentsStore } from "src/stores/comments";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import CommentItem from "./CommentItem.vue";

const props = defineProps({
  postId: { type: Number, required: true },
});

const authStore = useAuthStore();
const commentsStore = useCommentsStore();
const { t } = useI18n();

const newComment = ref("");
const posting = ref(false);
const page = ref(1);

const currentUser = computed(() => authStore.user);
const loading = computed(() => commentsStore.loading);
const postComments = computed(() =>
  commentsStore.getPostComments(props.postId)
);
const comments = computed(() => postComments.value.items);
const hasNextPage = computed(() => postComments.value.hasNextPage);

onMounted(reload);

async function reload() {
  page.value = 1;
  await commentsStore.fetchByPost(props.postId, 1);
}

async function loadMore() {
  page.value++;
  await commentsStore.fetchByPost(props.postId, page.value);
}

async function submitComment() {
  if (!newComment.value.trim()) return;
  posting.value = true;
  try {
    await commentsStore.addComment(props.postId, newComment.value.trim());
    newComment.value = "";
  } catch (_) {
    Notify.create({ type: "negative", message: t("comments.error") });
  } finally {
    posting.value = false;
  }
}
</script>

<style scoped>
.tw-composer {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(79, 134, 247, 0.12);
}
</style>
