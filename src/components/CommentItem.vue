<template>
  <div class="tw-comment" :class="{ 'tw-reply': isReply }">
    <!-- Avatar + connector line -->
    <div class="tw-thread-col">
      <q-avatar
        :size="isReply ? '28px' : '36px'"
        color="primary"
        text-color="white"
        class="tw-avatar cursor-pointer"
        @click="goToUser(comment.user?.userName)"
      >
        <img
          v-if="comment.user?.avatarUrl"
          :src="comment.user.avatarUrl"
          style="width: 100%; height: 100%; object-fit: cover"
        />
        <span v-else :style="{ fontSize: isReply ? '11px' : '13px' }">
          {{ comment.user?.identification?.[0]?.toUpperCase() || "?" }}
        </span>
      </q-avatar>
      <div
        v-if="
          !isReply && (showReplyInput || (showReplies && replyItems.length))
        "
        class="tw-connector"
      />
    </div>

    <!-- Content -->
    <div class="tw-content-col">
      <!-- Header: username · time · menu -->
      <div class="tw-header">
        <span
          class="text-white text-weight-semibold cursor-pointer"
          style="font-size: 0.87rem"
          @click="goToUser(comment.user?.userName)"
          >{{ comment.user?.identification }}</span
        >
        <span
          style="color: rgba(150, 170, 220, 0.45); font-size: 0.78rem"
          class="cursor-pointer"
          @click="goToUser(comment.user?.userName)"
        >
          @{{ comment.user?.userName }}</span
        >
        <span style="color: rgba(150, 170, 220, 0.35); font-size: 0.78rem">
          · {{ formatPostDate(comment.createdAt) }}</span
        >
        <q-btn
          v-if="isOwner"
          flat
          round
          dense
          size="xs"
          icon="more_horiz"
          color="grey-6"
          style="margin-left: auto"
          @click.stop
        >
          <q-menu anchor="bottom right" self="top right" dark>
            <q-list style="min-width: 130px">
              <q-item clickable v-close-popup dense @click="removeComment">
                <q-item-section style="color: #ef4444; font-size: 0.85rem">
                  {{ t("comments.delete") }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <!-- Comment text -->
      <p class="tw-body">{{ comment.content }}</p>

      <!-- Actions -->
      <div v-if="!isReply" class="tw-actions">
        <span class="tw-action" @click="showReplyInput = !showReplyInput">
          {{ t("comments.reply") }}
        </span>
        <span
          v-if="comment.replyCount > 0"
          class="tw-action tw-action-accent"
          @click="toggleReplies"
        >
          {{ showReplies ? t("comments.hide") : "" }}
          {{ comment.replyCount }}
          {{
            comment.replyCount === 1
              ? t("comments.replyWord")
              : t("comments.repliesWord")
          }}
        </span>
      </div>

      <!-- Reply composer -->
      <div v-if="showReplyInput && !isReply" class="tw-reply-composer q-mb-xs">
        <q-avatar
          size="26px"
          color="primary"
          text-color="white"
          style="font-size: 11px; flex-shrink: 0"
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
        <q-input
          v-model="replyContent"
          dense
          borderless
          class="col"
          :placeholder="t('comments.replyPlaceholder')"
          :maxlength="500"
          autofocus
          :input-style="{ color: '#dde4f0', fontSize: '0.85rem' }"
          @keyup.enter="submitReply"
        >
          <template #append>
            <q-btn
              flat
              dense
              round
              icon="send"
              color="accent"
              size="sm"
              :loading="replyLoading"
              :disable="!replyContent.trim()"
              @click="submitReply"
            />
          </template>
        </q-input>
      </div>

      <!-- Replies -->
      <div v-if="showReplies && !isReply" class="tw-replies">
        <div v-if="repliesLoading" class="flex flex-center q-py-sm">
          <q-spinner color="accent" size="16px" />
        </div>
        <CommentItem
          v-for="reply in replyItems"
          :key="reply.id"
          :comment="reply"
          :post-id="postId"
          :is-reply="true"
          @deleted="replyItems = replyItems.filter((r) => r.id !== reply.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useCommentsStore } from "src/stores/comments";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import { formatPostDate } from "src/util/date";

const props = defineProps({
  comment: { type: Object, required: true },
  postId: { type: Number, required: true },
  isReply: { type: Boolean, default: false },
});

const emit = defineEmits(["deleted"]);

const router = useRouter();
const authStore = useAuthStore();

function goToUser(userName) {
  if (userName) router.push({ name: "user-posts", params: { userName } });
}
const commentsStore = useCommentsStore();
const { t } = useI18n();

const showReplies = ref(false);
const showReplyInput = ref(false);
const replyContent = ref("");
const replyLoading = ref(false);
const repliesLoading = ref(false);
const replyItems = ref([]);

const currentUser = computed(() => authStore.user);
const isOwner = computed(
  () =>
    !!authStore.user?.userName &&
    authStore.user.userName === props.comment.user?.userName
);

async function toggleReplies() {
  showReplies.value = !showReplies.value;
  if (showReplies.value && replyItems.value.length === 0) {
    repliesLoading.value = true;
    try {
      const result = await commentsStore.fetchReplies(props.comment.id);
      replyItems.value = result.items;
    } finally {
      repliesLoading.value = false;
    }
  }
}

async function submitReply() {
  if (!replyContent.value.trim()) return;
  replyLoading.value = true;
  try {
    await commentsStore.addReply(
      props.postId,
      props.comment.id,
      replyContent.value.trim()
    );
    replyContent.value = "";
    showReplyInput.value = false;
    repliesLoading.value = true;
    try {
      const result = await commentsStore.fetchReplies(props.comment.id);
      replyItems.value = result.items;
      showReplies.value = true;
    } finally {
      repliesLoading.value = false;
    }
  } catch (_) {
    Notify.create({ type: "negative", message: t("comments.replyError") });
  } finally {
    replyLoading.value = false;
  }
}

async function removeComment() {
  try {
    await commentsStore.removeComment(props.postId, props.comment.id);
    emit("deleted");
  } catch (_) {
    Notify.create({ type: "negative", message: t("comments.deleteError") });
  }
}
</script>

<style scoped>
.tw-comment {
  display: flex;
  gap: 10px;
  padding: 12px 0 6px;
  border-bottom: 1px solid rgba(79, 134, 247, 0.08);
}

.tw-reply {
  padding-top: 8px;
  border-bottom: none;
}

.tw-thread-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36px;
  flex-shrink: 0;
}

.tw-connector {
  flex: 1;
  width: 2px;
  min-height: 14px;
  margin-top: 5px;
  background: rgba(79, 134, 247, 0.22);
  border-radius: 1px;
}

.tw-content-col {
  flex: 1;
  min-width: 0;
  padding-bottom: 2px;
}

.tw-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 3px;
  min-height: 22px;
}

.tw-body {
  color: #dde4f0;
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0 0 6px;
}

.tw-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 6px;
}

.tw-action {
  color: rgba(150, 170, 220, 0.45);
  font-size: 0.78rem;
  cursor: pointer;
  transition: color 0.15s;
}

.tw-action:hover {
  color: rgba(150, 170, 220, 0.8);
}

.tw-action-accent {
  color: #4f86f7;
  opacity: 0.8;
}

.tw-action-accent:hover {
  opacity: 1;
}

.tw-reply-composer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(79, 134, 247, 0.06);
  border: 1px solid rgba(79, 134, 247, 0.12);
  border-radius: 8px;
  margin-bottom: 8px;
}

.tw-replies {
  margin-top: 2px;
}
</style>
