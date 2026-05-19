<template>
  <q-dialog
    v-model="show"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <div class="post-detail-dialog q-pa-md">
      <div class="flex justify-between items-center q-mb-lg">
        <span class="text-white text-subtitle1 text-weight-semibold">{{
          $t("detail.title")
        }}</span>
        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          @click="show = false"
        />
      </div>

      <!-- Loading -->
      <div v-if="postsStore.loading" class="flex flex-center q-py-xl">
        <q-spinner color="accent" size="36px" />
      </div>

      <template v-else-if="post">
        <!-- Author -->
        <q-item class="q-pa-none q-mb-md">
          <q-item-section avatar @click="goToUser(post.user?.userName)">
            <q-avatar color="primary" text-color="white" class="cursor-pointer">
              <img
                v-if="post.user?.avatarUrl"
                :src="post.user.avatarUrl"
                style="width: 100%; height: 100%; object-fit: cover"
              />
              <span v-else>{{
                post.user?.identification?.[0]?.toUpperCase() || "?"
              }}</span>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label style="font-size: 0.9rem; line-height: 1.3">
              <span
                class="text-white text-weight-semibold cursor-pointer"
                @click="goToUser(post.user?.userName)"
                >{{ post.user?.identification }}</span
              >
              <span
                style="color: rgba(150, 170, 220, 0.5); font-size: 0.8rem"
                class="cursor-pointer"
                @click="goToUser(post.user?.userName)"
              >
                @{{ post.user?.userName }}</span
              >
              <span style="color: rgba(150, 170, 220, 0.35); font-size: 0.8rem">
                · {{ formatPostDate(post.createdAt) }}</span
              >
            </q-item-label>
          </q-item-section>
          <q-item-section side v-if="isOwner">
            <q-btn flat round dense size="sm" icon="more_vert" color="grey-5">
              <q-menu anchor="bottom right" self="top right" dark>
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup dense @click="confirmDelete">
                    <q-item-section style="color: #ef4444; font-size: 0.85rem">
                      {{ $t("post.deleteTooltip") }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>

        <!-- Content -->
        <p
          class="q-mb-lg"
          style="
            white-space: pre-wrap;
            word-break: break-word;
            color: #dde4f0;
            line-height: 1.55;
            font-size: 0.95rem;
          "
        >
          {{ post.content }}
        </p>

        <!-- Actions -->
        <div class="flex q-gutter-x-sm q-mb-md">
          <q-btn
            flat
            dense
            size="sm"
            :icon="localLiked ? 'favorite' : 'favorite_border'"
            :color="localLiked ? 'negative' : ''"
            :style="!localLiked ? 'color: rgba(150,170,220,0.45)' : ''"
            :label="String(localLikes)"
            :loading="liking"
            class="text-caption"
            @click="like"
          />
          <q-btn
            flat
            dense
            size="sm"
            icon="chat_bubble_outline"
            :label="String(commentCount)"
            class="text-caption"
            style="color: rgba(150, 170, 220, 0.45)"
          />
        </div>

        <q-separator
          style="background: rgba(79, 134, 247, 0.12)"
          class="q-mb-md"
        />

        <!-- Comments section -->
        <CommentList :post-id="post.id" @count-change="commentCount = $event" />
      </template>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { usePostsStore } from "src/stores/posts";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { LikesService } from "src/services/likes.service";
import { formatPostDate } from "src/util/date";
import CommentList from "./CommentList.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  postId: { type: Number, default: null },
});

const emit = defineEmits(["update:modelValue", "deleted"]);

const router = useRouter();
const postsStore = usePostsStore();

function goToUser(userName) {
  if (!userName) return;
  show.value = false;
  router.push({ name: "user-posts", params: { userName } });
}
const authStore = useAuthStore();
const $q = useQuasar();
const { t } = useI18n();

const isOwner = computed(
  () =>
    !!authStore.user?.userName &&
    authStore.user.userName === post.value?.user?.userName
);

const liking = ref(false);
const localLiked = ref(false);
const localLikes = ref(0);
const commentCount = ref(0);

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const post = computed(() => postsStore.currentPost);

function syncFromPost() {
  if (post.value) {
    localLiked.value = post.value.isLiked;
    localLikes.value = post.value.likes;
    commentCount.value = Array.isArray(post.value.comments)
      ? post.value.comments.length
      : 0;
  }
}

watch([() => props.modelValue, () => props.postId], async ([open, id]) => {
  if (open && id) {
    await postsStore.fetchPost(id);
    syncFromPost();
  }
});

function confirmDelete() {
  $q.dialog({
    title: t("post.deleteTitle"),
    message: t("post.deleteMessage"),
    ok: { label: t("post.deleteConfirm"), color: "negative", flat: true },
    cancel: { label: t("logout.cancel"), color: "white", flat: true },
    dark: true,
  }).onOk(async () => {
    try {
      await postsStore.deletePost(props.postId);
      emit("deleted", props.postId);
      show.value = false;
      $q.notify({ type: "positive", message: t("post.deleted") });
    } catch (_) {
      $q.notify({ type: "negative", message: t("post.deleteError") });
    }
  });
}

async function like() {
  liking.value = true;
  const was = localLiked.value;
  localLiked.value = !was;
  localLikes.value += was ? -1 : 1;
  try {
    await LikesService.toggle(props.postId);
  } catch (_) {
    localLiked.value = was;
    localLikes.value += was ? 1 : -1;
  } finally {
    liking.value = false;
  }
}
</script>
