<template>
  <q-layout view="hHh LpR lff">
    <q-page-container>
      <q-page class="login-page-bg flex flex-center column q-pa-md">
        <!-- Brand -->
        <div class="q-mb-xl text-center">
          <p class="nav-brand q-mb-xs" style="font-size: 2rem">
            &lt; AskFlow /&gt;
          </p>
          <p style="color: rgba(150, 170, 220, 0.45); font-size: 0.9rem">
            {{ $t("login.tagline") }}
          </p>
        </div>

        <q-card class="login-card q-pa-xl">
          <!-- Toggle login/register -->
          <p
            class="text-center q-mb-lg"
            style="font-size: 0.95rem; color: rgba(150, 170, 220, 0.6)"
          >
            <template v-if="isLogin">
              {{ $t("login.noAccount") }}
              <span
                class="text-accent cursor-pointer text-weight-medium"
                @click="switchMode(false)"
              >
                {{ $t("login.signUp") }}
              </span>
            </template>
            <template v-else>
              {{ $t("login.hasAccount") }}
              <span
                class="text-accent cursor-pointer text-weight-medium"
                @click="switchMode(true)"
              >
                {{ $t("login.signIn") }}
              </span>
            </template>
          </p>

          <q-form
            @submit.prevent="submit"
            class="flex flex-center column"
            style="gap: 14px"
          >
            <q-input
              v-if="!isLogin"
              v-model="userName"
              rounded
              standout
              class="full-width"
              :label="$t('login.username')"
              bg-color="primary"
              :input-style="{ color: 'white', fontSize: '1rem' }"
              label-color="grey-5"
              :rules="[(v) => !!v || $t('login.errorUsername')]"
              lazy-rules
            />

            <q-input
              v-if="!isLogin"
              v-model="identification"
              rounded
              standout
              class="full-width"
              :label="$t('login.identification')"
              prefix="@"
              bg-color="primary"
              :input-style="{ color: 'white', fontSize: '1rem' }"
              label-color="grey-5"
              :rules="[(v) => !!v || $t('login.errorIdentification')]"
              lazy-rules
            />

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
                (v) => /\S+@\S+\.\S+/.test(v) || $t('login.errorEmailInvalid'),
              ]"
              lazy-rules
            />

            <q-input
              v-model="password"
              rounded
              standout
              class="full-width"
              :label="$t('login.password')"
              :type="showPassword ? 'text' : 'password'"
              bg-color="primary"
              :input-style="{ color: 'white', fontSize: '1rem' }"
              label-color="grey-5"
              autocomplete="current-password"
              :rules="[
                (v) => !!v || $t('login.errorPasswordRequired'),
                (v) => isLogin || v.length >= 8 || $t('login.errorPasswordMin'),
              ]"
              lazy-rules
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  size="20px"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-input
              v-if="!isLogin"
              v-model="confirmPassword"
              rounded
              standout
              class="full-width"
              :label="$t('login.confirmPassword')"
              :type="showConfirmPassword ? 'text' : 'password'"
              bg-color="primary"
              :input-style="{ color: 'white', fontSize: '1rem' }"
              label-color="grey-5"
              autocomplete="new-password"
              :rules="[
                (v) => !!v || $t('login.errorConfirmRequired'),
                (v) => v === password || $t('login.errorPasswordMatch'),
              ]"
              lazy-rules
            >
              <template #append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  size="20px"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>

            <p
              v-if="!isLogin"
              class="full-width q-mb-none"
              style="
                font-size: 0.82rem;
                color: rgba(150, 170, 220, 0.45);
                padding: 0 4px;
                margin-top: -4px;
              "
            >
              {{ $t("login.passwordHint") }}
            </p>

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
              :label="
                isLogin ? $t('login.submitLogin') : $t('login.submitRegister')
              "
              :loading="loading"
              style="
                border-radius: 10px;
                font-weight: 600;
                font-size: 1rem;
                padding: 10px 0;
              "
            />
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const isLogin = ref(true);
const email = ref("");
const password = ref("");
const userName = ref("");
const identification = ref("");
const showPassword = ref(false);
const confirmPassword = ref("");
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMsg = ref("");

function switchMode(toLogin) {
  isLogin.value = toLogin;
  errorMsg.value = "";
  confirmPassword.value = "";
  password.value = "";
  email.value = "";
  userName.value = "";
  identification.value = "";
}

async function submit() {
  errorMsg.value = "";
  loading.value = true;
  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value);
      router.push({ name: "feed" });
    } else {
      await authStore.register(
        email.value,
        password.value,
        userName.value,
        identification.value
      );
      Notify.create({ type: "positive", message: t("login.success") });
      switchMode(true);
    }
  } catch (err) {
    const apiErr = err.response?.data;
    if (apiErr?.errors?.length) {
      errorMsg.value = apiErr.errors[0].message;
    } else if (apiErr?.message) {
      errorMsg.value = apiErr.message;
    } else {
      errorMsg.value = isLogin.value
        ? t("login.errorCredentials")
        : t("login.errorRegister");
    }
  } finally {
    loading.value = false;
  }
}
</script>
