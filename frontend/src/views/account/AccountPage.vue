<script setup>
import Header from '@/views/layout/HeaderComponent.vue'
import TabsLayout from '@/views/parts/TabsLayout.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ACCOUNT_MENU } from '@/constants/account-constants.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const authStore = useAuthStore()
</script>

<template>
  <div class="account-page | f-column">
    <Header />

    <div class="account-page__body | w-xl py-40 px-20 d-flex f-column g-30">
      <div class="d-flex a-center j-between f-wrap g-15">
        <h1 class="fs-700 fw-700">
          {{ t('account_page.title') }}
        </h1>

        <router-link
          v-if="authStore.user.value"
          :to="{ name: 'profile', params: { profileSlug: authStore.user.value.profileSlug } }"
          class="account-page__public | btn btn-sm btn-primary-alt d-flex a-center g-5"
        >
          <i class="fa-regular fa-eye"></i>
          {{ t('account_page.public_profile') }}
        </router-link>
      </div>

      <TabsLayout
        :items="ACCOUNT_MENU"
        labelPath="account_page.tabs"
      >
        <router-view v-if="authStore.isAuthenticated.value" />
      </TabsLayout>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.account-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1000px;

    @media (max-width: variables.$sm) {
      gap: 15px;
      padding-top: 20px;
    }
  }
}
</style>
