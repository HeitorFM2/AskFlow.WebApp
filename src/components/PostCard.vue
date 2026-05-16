<template>
  <q-card class="post-card q-mb-sm cursor-pointer" @click="emit('open', post)">
    <q-item class="q-pt-md q-pb-xs">
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white">
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
          <span class="text-white text-weight-semibold">{{
            post.user?.userName
          }}</span>
          <span style="color: rgba(150, 170, 220, 0.5); font-size: 0.8rem">
            @{{ post.user?.identification }}</span
          >
          <span style="color: rgba(150, 170, 220, 0.35); font-size: 0.8rem">
            · {{ formatPostDate(post.createdAt) }}</span
          >
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn
          flat
          round
          dense
          size="sm"
          icon="more_vert"
          color="grey-5"
          @click.stop
        >
          <q-menu anchor="bottom right" self="top right" dark>
            <q-list style="min-width: 140px">
              <q-item
                v-if="isOwner"
                clickable
                v-close-popup
                dense
                @click.stop="confirmDelete"
              >
                <q-item-section style="color: #ef4444; font-size: 0.85rem">
                  {{ t("post.deleteTooltip") }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>
    </q-item>

    <q-card-section class="q-pt-xs q-pb-sm">
      <p class="post-content q-mb-none">{{ post.content }}</p>
    </q-card-section>

    <q-card-actions class="q-pa-none q-px-md q-pb-sm" @click.stop>
      <q-btn
        flat
        dense
        :icon="post.isLiked ? 'favorite' : 'favorite_border'"
        :color="post.isLiked ? 'negative' : ''"
        :style="!post.isLiked ? 'color: rgba(150,170,220,0.45)' : ''"
        :label="String(post.likes)"
        :loading="liking"
        @click="like"
        class="text-caption"
        size="sm"
      />
      <q-btn
        flat
        dense
        icon="chat_bubble_outline"
        :label="String(post.comments)"
        class="text-caption"
        style="color: rgba(150, 170, 220, 0.45)"
        size="sm"
        @click="emit('open', post)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "src/stores/auth";
import { usePostsStore } from "src/stores/posts";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { formatPostDate } from "src/util/date";

const props = defineProps({
  post: { type: Object, required: true },
});

const emit = defineEmits(["open", "deleted", "unliked"]);

const $q = useQuasar();
const authStore = useAuthStore();
const postsStore = usePostsStore();
const { t } = useI18n();

const liking = ref(false);

const isOwner = computed(
  () =>
    !!authStore.user?.identification &&
    authStore.user.identification === props.post.user?.identification
);

async function like() {
  const wasLiked = props.post.isLiked;
  liking.value = true;
  try {
    await postsStore.toggleLike(props.post.id);
    if (wasLiked) emit("unliked", props.post.id);
  } finally {
    liking.value = false;
  }
}

function confirmDelete() {
  $q.dialog({
    title: t("post.deleteTitle"),
    message: t("post.deleteMessage"),
    ok: { label: t("post.deleteConfirm"), color: "negative", flat: true },
    cancel: { label: t("logout.cancel"), color: "white", flat: true },
    dark: true,
  }).onOk(async () => {
    try {
      await postsStore.deletePost(props.post.id);
      emit("deleted", props.post.id);
      $q.notify({ type: "positive", message: t("post.deleted") });
    } catch {
      $q.notify({ type: "negative", message: t("post.deleteError") });
    }
  });
}
</script>
