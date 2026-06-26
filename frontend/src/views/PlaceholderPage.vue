<template>
  <div class="placeholder-page">
    <h1>{{ routeName }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const routeName = route.meta?.title as string || 'Page'
</script>

<style scoped lang="scss">
.placeholder-page {
  h1 {
    color: var(--color-text);
    margin: 0;
  }
}
</style>
