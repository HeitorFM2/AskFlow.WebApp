<template>
  <q-dialog v-model="show" persistent>
    <q-card
      style="
        min-width: 320px;
        width: 100%;
        max-width: 420px;
        background: #0d1117;
        border: 1px solid rgba(79, 134, 247, 0.15);
        border-radius: 14px;
      "
    >
      <q-card-section class="flex justify-between items-center q-pb-sm">
        <span class="text-white text-weight-bold" style="font-size: 1rem">{{
          $t("profile.editTitle")
        }}</span>
        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          @click="show = false"
        />
      </q-card-section>

      <q-card-section class="q-pt-xs q-pb-sm">
        <q-input
          v-model="form.identification"
          :label="$t('profile.editIdentification')"
          dark
          filled
          dense
          :error="!!errors.identification"
          :error-message="errors.identification"
          class="q-mb-md"
          @keyup.enter="submit"
        />
        <q-input
          v-model="form.userName"
          :label="$t('profile.editUserName')"
          dark
          filled
          dense
          prefix="@"
          :error="!!errors.userName"
          :error-message="errors.userName"
          @keyup.enter="submit"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md q-pt-xs">
        <q-btn
          flat
          :label="$t('logout.cancel')"
          color="white"
          :disable="loading"
          @click="show = false"
        />
        <q-btn
          unelevated
          :label="$t('profile.editSave')"
          color="accent"
          :loading="loading"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const authStore = useAuthStore();
const $q = useQuasar();
const { t } = useI18n();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const loading = ref(false);
const form = ref({ identification: "", userName: "" });
const errors = ref({ identification: "", userName: "" });

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = {
        identification: authStore.user?.identification ?? "",
        userName: authStore.user?.userName ?? "",
      };
      errors.value = { identification: "", userName: "" };
    }
  }
);

function validate() {
  errors.value = { identification: "", userName: "" };
  let valid = true;

  if (!form.value.identification.trim()) {
    errors.value.identification = t("profile.errorIdentificationRequired");
    valid = false;
  }

  const userName = form.value.userName.trim();
  if (!userName) {
    errors.value.userName = t("profile.errorUserNameRequired");
    valid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
    errors.value.userName = t("profile.errorUserNameInvalid");
    valid = false;
  }

  return valid;
}

async function submit() {
  if (!validate()) return;
  loading.value = true;
  try {
    await authStore.updateProfile(
      form.value.userName.trim(),
      form.value.identification.trim()
    );
    $q.notify({ type: "positive", message: t("profile.editSuccess") });
    window.location.reload();
  } catch (err) {
    const apiMsg = err.response?.data?.message ?? err.response?.data;
    $q.notify({
      type: "negative",
      message: typeof apiMsg === "string" ? apiMsg : t("profile.editError"),
    });
  } finally {
    loading.value = false;
  }
}
</script>
