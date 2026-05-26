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
          <template v-if="!sent">
            <p
              class="text-center q-mb-xs"
              style="font-size: 1.2rem; font-weight: 600; color: white"
            >
              {{ $t("forgotPassword.title") }}
            </p>
            <p
              class="text-center q-mb-lg"
              style="font-size: 0.88rem; color: rgba(150, 170, 220, 0.6)"
            >
              {{ $t("forgotPassword.subtitle") }}
            </p>

            <q-form
              ref="formRef"
              @submit.prevent="submit"
              class="flex flex-center column"
              style="gap: 14px"
            >
              <q-input
                v-model="email"
                rounded
                standout
                class="full-width"
                :label="$t('login.email')"
                type="email"
                bg-color="primary"
                :input-style="{ color: 'white', fontSize: '1rem' }"
                label-color="grey-5"
                :rules="[
                  (v) => !!v || $t('login.errorEmailRequired'),
                  (v) =>
                    /\S+@\S+\.\S+/.test(v) || $t('login.errorEmailInvalid'),
                ]"
                lazy-rules
              />

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
                :label="$t('forgotPassword.submit')"
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
              <q-icon name="mark_email_read" color="accent" size="3rem" />
              <p style="font-size: 1rem; color: white; margin: 0">
                {{ $t("forgotPassword.successMsg") }}
              </p>
            </div>
          </template>

          <div class="text-center q-mt-lg">
            <span
              class="text-accent cursor-pointer"
              style="font-size: 0.88rem"
              @click="router.push({ name: 'login' })"
            >
              {{ $t("forgotPassword.backToLogin") }}
            </span>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "src/services/auth.service";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

const formRef = ref(null);
const email = ref("");
const loading = ref(false);
const errorMsg = ref("");
const sent = ref(false);

async function submit() {
  errorMsg.value = "";
  loading.value = true;
  try {
    await AuthService.forgotPassword({ email: email.value });
    sent.value = true;
  } catch (err) {
    const apiErr = err.response?.data;
    if (apiErr?.errors?.length) {
      errorMsg.value = apiErr.errors[0].message;
    } else if (apiErr?.message) {
      errorMsg.value = apiErr.message;
    } else {
      errorMsg.value = t("forgotPassword.errorGeneric");
    }
  } finally {
    loading.value = false;
  }
}
</script>
