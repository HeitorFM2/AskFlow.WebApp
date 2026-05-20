<template>
  <q-card class="composer-card q-pa-md">
    <div class="flex items-start" style="gap: 12px">
      <q-avatar color="primary" text-color="white" style="flex-shrink: 0">
        <img
          v-if="user?.avatarUrl"
          :src="user.avatarUrl"
          style="width: 100%; height: 100%; object-fit: cover"
        />
        <span v-else>{{
          user?.identification?.[0]?.toUpperCase() || "?"
        }}</span>
      </q-avatar>

      <q-input
        v-model="content"
        borderless
        autogrow
        type="textarea"
        :maxlength="280"
        class="col"
        :placeholder="$t('composer.placeholder')"
        :input-style="{
          resize: 'none',
          color: '#dde4f0',
          minHeight: '72px',
          fontSize: '0.95rem',
        }"
        counter
      />
    </div>

    <p v-if="error" class="text-negative text-caption q-mb-none q-mt-xs">
      {{ error }}
    </p>

    <q-card-actions align="right" class="q-pa-none q-pt-sm">
      <q-btn
        push
        color="accent"
        round
        icon="send"
        :loading="loading"
        @click="submit"
        :disable="!content.trim()"
        size="sm"
      >
        <q-tooltip>{{ $t("composer.tooltip") }}</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "src/stores/auth";
import { usePostsStore } from "src/stores/posts";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";

const authStore = useAuthStore();
const postsStore = usePostsStore();
const { t } = useI18n();

const content = ref("");
const loading = ref(false);
const error = ref("");

const user = computed(() => authStore.user);

async function submit() {
  error.value = "";
  if (!content.value.trim()) return;

  loading.value = true;
  try {
    await postsStore.createPost(content.value.trim());
    content.value = "";
    Notify.create({ type: "positive", message: t("composer.created") });
  } catch (err) {
    const apiErr = err.response?.data;
    error.value =
      apiErr?.errors?.[0]?.message || apiErr?.message || t("composer.error");
  } finally {
    loading.value = false;
  }
}
</script>
