<template>
  <q-card class="post-card q-mb-sm cursor-pointer" @click="emit('open', post)">
    <q-item class="q-pt-md q-pb-xs">
      <q-item-section avatar @click.stop="goToUser(post.user)">
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
            @click.stop="goToUser(post.user)"
            >{{ post.user?.identification }}</span
          >
          <span
            style="color: rgba(150, 170, 220, 0.5); font-size: 0.8rem"
            class="cursor-pointer"
            @click.stop="goToUser(post.user)"
          >
            @{{ post.user?.userName }}</span
          >
          <span style="color: rgba(150, 170, 220, 0.35); font-size: 0.8rem">
            · {{ formatPostDate(post.createdAt) }}</span
          >
        </q-item-label>
      </q-item-section>

      <q-item-section v-if="isOwner || !hideFollow" side>
        <q-btn
          flat
          round
          dense
          size="sm"
          icon="more_vert"
          color="grey-5"
          :loading="checkingFollow"
          @click.stop="openMenu"
        >
          <q-menu
            ref="menuRef"
            v-model="menuOpen"
            no-parent-event
            anchor="bottom right"
            self="top right"
            dark
          >
            <q-list style="min-width: 140px">
              <q-item
                v-if="!isOwner"
                clickable
                v-close-popup
                dense
                :disable="following"
                @click.stop="toggleFollow"
              >
                <q-item-section style="font-size: 0.85rem">
                  {{
                    localIsFollowing
                      ? $t("follows.unfollowUser", {
                          user: "@" + post.user?.userName,
                        })
                      : $t("follows.followUser", {
                          user: "@" + post.user?.userName,
                        })
                  }}
                </q-item-section>
              </q-item>
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
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { usePostsStore } from "src/stores/posts";
import { useFollowsStore } from "src/stores/follows";
import { FollowsService } from "src/services/follows.service";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { formatPostDate } from "src/util/date";

const props = defineProps({
  post: { type: Object, required: true },
  hideFollow: { type: Boolean, default: false },
});

const emit = defineEmits(["open", "deleted", "unliked"]);

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const postsStore = usePostsStore();
const followsStore = useFollowsStore();
const { t } = useI18n();

function goToUser(user) {
  if (user?.userName)
    router.push({
      name: "user-posts",
      params: { userName: user.userName },
      state: { profileUser: JSON.stringify(user) },
    });
}

const menuRef = ref(null);
const menuOpen = ref(false);
const liking = ref(false);
const following = ref(false);
const checkingFollow = ref(false);
const localIsFollowing = ref(null);

const isOwner = computed(
  () =>
    !!authStore.user?.userName &&
    authStore.user.userName === props.post.user?.userName
);

async function openMenu() {
  if (menuOpen.value) {
    menuRef.value.hide();
    return;
  }
  if (
    !isOwner.value &&
    props.post.user?.userName &&
    localIsFollowing.value === null
  ) {
    checkingFollow.value = true;
    try {
      localIsFollowing.value = await FollowsService.isFollowing(
        props.post.user.userName
      );
    } finally {
      checkingFollow.value = false;
    }
  }
  menuRef.value.show();
}

async function toggleFollow() {
  const prev = localIsFollowing.value;
  localIsFollowing.value = !prev;
  following.value = true;
  try {
    await followsStore.toggleFollow(
      props.post.user.id,
      props.post.user.userName,
      prev
    );
  } catch (_) {
    localIsFollowing.value = prev;
  } finally {
    following.value = false;
  }
}

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
    } catch (_) {
      $q.notify({ type: "negative", message: t("post.deleteError") });
    }
  });
}
</script>
