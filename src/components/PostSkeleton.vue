<template>
  <q-card v-for="i in count" :key="i" class="post-card q-mb-sm">
    <q-item class="q-pt-md">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>
      <q-item-section>
        <q-skeleton type="text" width="40%" />
        <q-skeleton type="text" width="25%" />
      </q-item-section>
    </q-item>
    <q-card-section>
      <q-skeleton type="text" />
      <q-skeleton type="text" width="70%" />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 3 },
})
</script>
