<template>
  <q-layout view="hHh LpR lff">
    <!-- Mobile top bar -->
    <div
      class="mobile-topbar flex justify-between items-center q-pa-sm q-px-md lt-md"
    >
      <div class="flex items-center q-gutter-x-xs">
        <q-btn
          flat
          round
          dense
          icon="menu"
          color="accent"
          @click="leftDrawer = true"
        />
        <span
          class="nav-brand"
          style="font-size: 1.1rem; cursor: pointer"
          @click="navigate('feed')"
          >&lt; AskFlow /&gt;</span
        >
      </div>
      <q-avatar
        size="36px"
        color="primary"
        text-color="white"
        class="text-subtitle1 cursor-pointer"
        style="border: 1.5px solid rgba(79, 134, 247, 0.4)"
        @click="rightDrawer = true"
      >
        <img
          v-if="user?.avatarUrl"
          :src="user.avatarUrl"
          style="width: 100%; height: 100%; object-fit: cover"
        />
        <span v-else>{{
          user?.identification?.[0]?.toUpperCase() || "?"
        }}</span>
      </q-avatar>
    </div>

    <!-- Left nav drawer (Feed only) -->
    <q-drawer
      v-model="leftDrawer"
      show-if-above
      :breakpoint="1024"
      class="nav-drawer"
    >
      <q-scroll-area class="fit">
        <div class="q-px-md q-pt-xl q-pb-lg">
          <div
            class="nav-brand"
            style="font-size: 1.15rem; cursor: pointer"
            @click="navigate('feed')"
          >
            &lt; AskFlow /&gt;
          </div>
        </div>

        <q-separator
          style="background: rgba(79, 134, 247, 0.1)"
          class="q-mx-md"
        />

        <q-list class="q-mt-sm q-pb-md">
          <q-item
            v-for="nav in navItems"
            :key="nav.key"
            clickable
            :class="[
              'nav-item',
              $route.name === nav.route ? 'nav-item-active' : '',
            ]"
            @click="navigate(nav.route)"
          >
            <q-item-section avatar style="min-width: 36px">
              <q-icon
                :name="nav.icon"
                :color="$route.name === nav.route ? 'accent' : ''"
                size="20px"
              />
            </q-item-section>
            <q-item-section style="font-size: 0.93rem; font-weight: 500">
              {{ $t(nav.labelKey) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Right profile drawer -->
    <q-drawer
      v-model="rightDrawer"
      side="right"
      show-if-above
      :breakpoint="1024"
      :width="268"
      class="profile-drawer"
    >
      <div class="column fit" style="height: 100%">
        <!-- Header row: lang toggle (left) + close (right) — mobile only -->
        <div class="flex justify-between items-center q-pa-sm lt-md">
          <q-btn
            flat
            round
            dense
            @click="toggleLang"
            style="min-width: 34px; min-height: 34px"
          >
            <span style="font-size: 1.2rem; line-height: 1">{{
              locale === "pt-BR" ? "🇧🇷" : "🇺🇸"
            }}</span>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="close"
            color="white"
            size="sm"
            @click="rightDrawer = false"
          />
        </div>

        <!-- Avatar + name -->
        <div class="flex flex-center column q-pt-xl q-px-lg q-pb-lg">
          <div class="avatar-upload-wrap" @click="triggerAvatarUpload">
            <div class="avatar-ring">
              <q-avatar
                size="80px"
                color="primary"
                text-color="white"
                class="text-h4"
              >
                <img
                  v-if="user?.avatarUrl"
                  :src="user.avatarUrl"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
                <span v-else>{{
                  user?.identification?.[0]?.toUpperCase() || "?"
                }}</span>
              </q-avatar>
            </div>
            <div class="avatar-cam-badge">
              <q-icon name="photo_camera" color="white" size="11px" />
            </div>
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 6]"
            >
              {{ $t("profile.updatePhoto") }}
            </q-tooltip>
          </div>

          <div v-if="uploadingAvatar" class="q-mt-sm">
            <q-spinner color="accent" size="16px" />
            <span class="text-caption text-accent q-ml-xs">{{
              $t("profile.uploading")
            }}</span>
          </div>

          <div class="flex items-center q-mt-md q-mb-xs" style="gap: 4px">
            <p class="text-white text-subtitle2 text-weight-bold q-mb-none">
              {{ user?.identification }}
            </p>
            <q-btn
              flat
              round
              dense
              size="xs"
              icon="edit"
              color="grey-5"
              @click="editProfileOpen = true"
            />
          </div>
          <p
            class="q-mb-none"
            style="font-size: 0.78rem; color: rgba(150, 170, 220, 0.55)"
          >
            @{{ user?.userName }}
          </p>

          <!-- Followers / Following counts -->
          <div class="flex justify-center q-gutter-x-xl q-mt-md">
            <div
              class="text-center cursor-pointer"
              @click="navigateProfile('followers')"
            >
              <div
                class="text-white text-weight-bold"
                style="font-size: 0.95rem; line-height: 1.2"
              >
                {{ followsStore.counts.followers }}
              </div>
              <div style="font-size: 0.7rem; color: rgba(150, 170, 220, 0.55)">
                {{ $t("follows.followers") }}
              </div>
            </div>
            <div
              class="text-center cursor-pointer"
              @click="navigateProfile('following')"
            >
              <div
                class="text-white text-weight-bold"
                style="font-size: 0.95rem; line-height: 1.2"
              >
                {{ followsStore.counts.following }}
              </div>
              <div style="font-size: 0.7rem; color: rgba(150, 170, 220, 0.55)">
                {{ $t("follows.following") }}
              </div>
            </div>
          </div>
        </div>

        <q-separator
          style="background: rgba(79, 134, 247, 0.1)"
          class="q-mx-md"
        />

        <!-- Profile nav items -->
        <q-list class="q-mt-sm">
          <q-item
            v-for="nav in profileNavItems"
            :key="nav.key"
            clickable
            :class="[
              'nav-item',
              $route.name === nav.route ? 'nav-item-active' : '',
            ]"
            @click="navigateProfile(nav.route)"
          >
            <q-item-section avatar style="min-width: 36px">
              <q-icon
                :name="nav.icon"
                :color="$route.name === nav.route ? 'accent' : ''"
                size="20px"
              />
            </q-item-section>
            <q-item-section style="font-size: 0.93rem; font-weight: 500">
              {{ $t(nav.labelKey) }}
            </q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <q-separator
          style="background: rgba(79, 134, 247, 0.1)"
          class="q-mx-md"
        />

        <!-- Logout -->
        <q-list class="q-mb-sm">
          <q-item clickable class="nav-item" @click="confirmLogout">
            <q-item-section avatar style="min-width: 36px">
              <q-icon name="logout" color="negative" size="20px" />
            </q-item-section>
            <q-item-section
              style="font-size: 0.93rem; font-weight: 500; color: #ef4444"
            >
              {{ $t("nav.logout") }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- Hidden file input -->
    <input
      ref="avatarInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="uploadAvatar"
    />

    <!-- Page content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <EditProfileModal v-model="editProfileOpen" />
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useFollowsStore } from "src/stores/follows";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { i18n } from "src/i18n";
import EditProfileModal from "src/components/EditProfileModal.vue";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const followsStore = useFollowsStore();
const { t, locale } = useI18n();

onMounted(() => followsStore.loadCounts());

const leftDrawer = ref(false);
const rightDrawer = ref(false);
const avatarInput = ref(null);
const uploadingAvatar = ref(false);
const editProfileOpen = ref(false);

const user = computed(() => authStore.user);

const navItems = [
  { key: "feed", labelKey: "nav.feed", route: "feed", icon: "dynamic_feed" },
  {
    key: "following-feed",
    labelKey: "nav.followingFeed",
    route: "following-feed",
    icon: "group",
  },
];

const profileNavItems = [
  {
    key: "my-posts",
    labelKey: "nav.myPosts",
    route: "my-posts",
    icon: "edit_note",
  },
  { key: "liked", labelKey: "nav.likes", route: "liked", icon: "favorite" },
];

function navigate(routeName) {
  router.push({ name: routeName });
  if ($q.screen.lt.md) leftDrawer.value = false;
}

function navigateProfile(routeName) {
  router.push({ name: routeName });
  if ($q.screen.lt.md) rightDrawer.value = false;
}

function triggerAvatarUpload() {
  avatarInput.value?.click();
}

async function uploadAvatar(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    $q.notify({ type: "negative", message: t("profile.imageTooLarge") });
    event.target.value = "";
    return;
  }

  uploadingAvatar.value = true;
  try {
    await authStore.updateAvatar(file);
    $q.notify({ type: "positive", message: t("profile.photoUpdated") });
  } catch (_) {
    $q.notify({ type: "negative", message: t("profile.photoError") });
  } finally {
    uploadingAvatar.value = false;
    event.target.value = "";
  }
}

function toggleLang() {
  const next = locale.value === "pt-BR" ? "en" : "pt-BR";
  locale.value = next;
  i18n.global.locale.value = next;
  localStorage.setItem("locale", next);
}

function confirmLogout() {
  $q.dialog({
    title: t("logout.title"),
    message: t("logout.message"),
    ok: { label: t("logout.confirm"), color: "negative", flat: true },
    cancel: { label: t("logout.cancel"), color: "white", flat: true },
    dark: true,
  }).onOk(async () => {
    await authStore.logout();
    router.push({ name: "login" });
  });
}
</script>
