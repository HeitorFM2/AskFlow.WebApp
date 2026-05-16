<template>
  <div class="fullscreen flex flex-center column text-center q-pa-md" style="background: #0d0f1a">
    <p class="nav-brand q-mb-lg" style="font-size: 1.4rem">&lt; AskFlow /&gt;</p>
    <div style="font-size: 8rem; font-weight: 700; color: #4f86f7; line-height: 1">404</div>
    <p class="q-mt-md q-mb-xl" style="color: rgba(150,170,220,0.5); font-size: 1rem">
      {{ $t('notFound.title') }}
    </p>
    <q-btn
      unelevated
      color="accent"
      :label="$t('notFound.home')"
      to="/"
      style="border-radius: 10px; font-weight: 600"
    />
  </div>
</template>

<script setup>
</script>
