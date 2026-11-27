<script setup>
import Header from '@/views/layout/HeaderComponent.vue'
import TabsLayout from '@/views/parts/TabsLayout.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { READINGS_MENU } from '@/constants/reading-constants.js'
import { useReadingsHead } from '@/head/use-readings-head.js'

useReadingsHead()
</script>

<template>
  <div class="readings-page | f-column">
    <Header />

    <div class="readings-page__body | w-xl py-40 px-20 d-flex f-column g-30">
      <h1 class="fs-700 fw-700">
        {{ t('readings.title') }}
      </h1>

      <TabsLayout
        :items="READINGS_MENU"
        labelPath="readings.tabs"
      >
        <router-view />
      </TabsLayout>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.readings-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;

    @media (max-width: variables.$sm) {
      gap: 15px;
      padding-top: 20px;
    }
  }
}
</style>
