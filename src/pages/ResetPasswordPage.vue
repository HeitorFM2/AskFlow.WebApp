<template>
  <q-layout view="hHh LpR lff">
    <q-page-container>
      <q-page class="login-page-bg flex flex-center column q-pa-md">
        <div class="q-mb-xl text-center">
          <p class="nav-brand q-mb-xs" style="font-size: 2rem">
            &lt; AskFlow /&gt;
          </p>
        </div>

        <q-card class="login-card q-pa-xl">
          <template v-if="isValidLink">
            <p
              class="text-center q-mb-lg"
              style="font-size: 1.2rem; font-weight: 600; color: white"
            >
              {{ $t("resetPassword.title") }}
            </p>

            <q-form
              ref="formRef"
              @submit.prevent="submit"
              class="flex flex-center column"
              style="gap: 14px"
            >
              <q-input
                v-model="newPassword"
                rounded
                standout
                class="full-width"
                :label="$t('resetPassword.newPassword')"
                :type="showNew ? 'text' : 'password'"
                bg-color="primary"
                :input-style="{ color: 'white', fontSize: '1rem' }"
                label-color="grey-5"
                autocomplete="new-password"
                :rules="[
                  (v) => !!v || $t('resetPassword.errorPasswordRequired'),
                  (v) => v.length >= 8 || $t('resetPassword.errorPasswordMin'),
                ]"
                lazy-rules
              >
                <template #append>
                  <q-icon
                    :name="showNew ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-5"
                    size="20px"
                    @click="showNew = !showNew"
                  />
                </template>
              </q-input>

              <q-input
                v-model="confirmPassword"
                rounded
                standout
                class="full-width"
                :label="$t('resetPassword.confirmPassword')"
                :type="showConfirm ? 'text' : 'password'"
                bg-color="primary"
                :input-style="{ color: 'white', fontSize: '1rem' }"
                label-color="grey-5"
                autocomplete="new-password"
                :rules="[
                  (v) => !!v || $t('resetPassword.errorConfirmRequired'),
                  (v) =>
                    v === newPassword || $t('resetPassword.errorPasswordMatch'),
                ]"
                lazy-rules
              >
                <template #append>
                  <q-icon
                    :name="showConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-5"
                    size="20px"
                    @click="showConfirm = !showConfirm"
                  />
                </template>
              </q-input>

              <p
                v-if="errorMsg"
                class="text-negative text-center q-mb-none"
                style="font-size: 0.88rem"
              >
                {{ errorMsg }}
              </p>

              <q-btn
                color="accent"
                class="full-width q-mt-xs"
                type="submit"
                unelevated
                :label="$t('resetPassword.submit')"
                :loading="loading"
                style="
                  border-radius: 10px;
                  font-weight: 600;
                  font-size: 1rem;
                  padding: 10px 0;
                "
              />
            </q-form>
          </template>

          <template v-else>
            <div
              class="flex flex-center column"
              style="gap: 16px; text-align: center"
            >
              <q-icon name="link_off" color="negative" size="3rem" />
              <p
                style="
                  font-size: 0.95rem;
                  color: rgba(150, 170, 220, 0.7);
                  margin: 0;
                "
              >
                {{ $t("resetPassword.invalidLink") }}
              </p>
              <q-btn
                flat
                color="accent"
                :label="$t('forgotPassword.backToLogin')"
                @click="router.push({ name: 'forgot-password' })"
              />
            </div>
          </template>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();

const token = route.query.token ?? "";
const email = route.query.email ?? "";
const isValidLink = computed(() => !!token && !!email);

const formRef = ref(null);
const newPassword = ref("");
const confirmPassword = ref("");
const showNew = ref(false);
const showConfirm = ref(false);
const loading = ref(false);
const errorMsg = ref("");

async function submit() {
  errorMsg.value = "";
  loading.value = true;
  try {
    await authStore.resetPassword(
      email,
      token,
      newPassword.value,
      confirmPassword.value
    );
    Notify.create({ type: "positive", message: t("resetPassword.successMsg") });
    router.push({ name: "feed" });
  } catch (err) {
    const apiErr = err.response?.data;
    if (apiErr?.errors?.length) {
      errorMsg.value = apiErr.errors[0].message;
    } else if (apiErr?.message) {
      errorMsg.value = apiErr.message;
    } else {
      errorMsg.value = t("resetPassword.errorGeneric");
    }
  } finally {
    loading.value = false;
  }
}
</script>
