<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
</script>

<template>
  <div class="moderation-desktop-only__content">
    <slot></slot>
  </div>
  <div
    class="moderation-desktop-only__screen-too-small | f-column a-center g-15 text-center px-20 py-40"
  >
    <i class="moderation-desktop-only__icon | fa-solid fa-desktop color-primary"></i>
    <p class="fs-600 fw-700">
      {{ t('moderation_desktop_only.title') }}
    </p>
    <p class="color-neutral-700">
      {{ t('moderation_desktop_only.message') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.moderation-desktop-only {
  &__screen-too-small {
    display: none;
  }

  &__icon {
    font-size: 2.5rem;
  }

  @media (max-width: variables.$md) {
    &__content {
      display: none;
    }

    &__screen-too-small {
      display: flex;
    }
  }
}
</style>
