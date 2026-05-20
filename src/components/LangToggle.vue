<template>
  <q-btn round flat dense class="lang-toggle" @click="toggle">
    <span class="lang-flag">{{ locale === "pt-BR" ? "🇧🇷" : "🇺🇸" }}</span>
    <q-tooltip anchor="bottom right" self="top right" :offset="[0, 6]">
      {{ locale === "pt-BR" ? "Switch to English" : "Mudar para Português" }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { i18n } from "src/i18n";

const { locale } = useI18n();

function toggle() {
  const next = locale.value === "pt-BR" ? "en" : "pt-BR";
  locale.value = next;
  i18n.global.locale.value = next;
  localStorage.setItem("locale", next);
}
</script>

<style scoped>
.lang-toggle {
  position: fixed;
  top: 10px;
  right: 12px;
  z-index: 2100;
  width: 38px;
  height: 38px;
  background: rgba(22, 27, 44, 0.9) !important;
  border: 1px solid rgba(79, 134, 247, 0.2);
  backdrop-filter: blur(8px);
  transition: border-color 0.18s ease, background 0.18s ease;
}

.lang-toggle:hover {
  border-color: rgba(79, 134, 247, 0.5) !important;
  background: rgba(30, 35, 58, 0.95) !important;
}

.lang-flag {
  font-size: 1.25rem;
  line-height: 1;
}

@media (max-width: 1023px) {
  .lang-toggle {
    display: none !important;
  }
}
</style>
