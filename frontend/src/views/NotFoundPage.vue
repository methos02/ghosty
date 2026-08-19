<script setup>
import Header from '@/views/layout/HeaderComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useNotFoundHead } from '@/head/use-not-found-head.js'

useNotFoundHead()
</script>

<template>
  <div class="not-found-page | f-column">
    <Header />
    <div class="not-found-page__body | w-xl f-column j-center a-center g-20 flex-1 text-center">
      <p class="not-found-page__code | fw-700 color-primary">404</p>
      <h1 class="fw-400">{{ t('not_found.title') }}</h1>
      <p class="color-neutral-700">{{ t('not_found.message') }}</p>
      <RouterLink
        to="/"
        class="btn btn-primary fs-700 px-50 py-10"
      >
        {{ t('not_found.back_home') }}
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss">
.not-found-page {
  min-height: 100vh;

  .header {
    background-color: var(--secondary);
  }

  &__body {
    margin: 0 auto;
    padding: 80px 20px;
  }

  &__code {
    font-size: clamp(4rem, 12vw, 8rem);
    line-height: 1;
  }
}
</style>
