<script setup>
import Header from '@/views/layout/HeaderComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useFavoritesHead } from '@/head/use-favorites-head.js'

useFavoritesHead()
</script>

<template>
  <div class="favorites-page | f-column">
    <Header />

    <div class="favorites-page__body | w-xl py-40 px-20">
      <h1 class="fs-700 fw-700 mb-20">
        {{ t('favorites.title') }}
      </h1>

      <p class="color-neutral-700">
        {{ t('favorites.coming') }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.favorites-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 900px;
  }
}
</style>
