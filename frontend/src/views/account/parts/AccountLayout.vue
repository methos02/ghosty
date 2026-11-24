<script setup>
import Header from '@/views/layout/HeaderComponent.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { ACCOUNT_TABS } from '@/constants/account-constants.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const MENU_ITEMS = [
  {
    tab: ACCOUNT_TABS.PROFILE,
    icon: 'fa-regular fa-user',
  },
  {
    tab: ACCOUNT_TABS.SECURITY,
    icon: 'fa-solid fa-lock',
  },
  {
    tab: ACCOUNT_TABS.STATISTICS,
    icon: 'fa-solid fa-chart-simple',
  },
]

const currentRoute = route.current()
const authStore = useAuthStore()

const isCurrent = tab => currentRoute.value.name === tab
</script>

<template>
  <div class="account-layout | f-column">
    <Header />

    <div class="account-layout__body | w-xl py-40 px-20 d-flex f-column g-30">
      <div class="d-flex a-center j-between f-wrap g-15">
        <h1 class="fs-700 fw-700">
          {{ t('account_layout.title') }}
        </h1>

        <router-link
          v-if="authStore.user.value"
          :to="{ name: 'profile', params: { profileSlug: authStore.user.value.profileSlug } }"
          class="account-layout__public | btn btn-sm btn-primary-alt d-flex a-center g-5"
        >
          <i class="fa-regular fa-eye"></i>
          {{ t('account_layout.public_profile') }}
        </router-link>
      </div>

      <div class="d-flex a-start g-30 f-column-md">
        <nav class="account-layout__menu | bg-neutral-200 radius-10 py-10">
          <ul class="d-flex f-column">
            <li
              v-for="item in MENU_ITEMS"
              :key="item.tab"
            >
              <router-link
                :to="{ name: item.tab }"
                :aria-current="isCurrent(item.tab) ? 'page' : undefined"
                class="account-layout__link | d-flex a-center g-15 px-20 py-10"
                :class="{ 'account-layout__link--current': isCurrent(item.tab) }"
              >
                <i
                  class="account-layout__icon"
                  :class="item.icon"
                ></i>
                {{ t(`account_layout.tabs.${item.tab}`) }}
              </router-link>
            </li>
          </ul>
        </nav>

        <main class="account-layout__content | flex-1 d-flex f-column g-30">
          <slot v-if="authStore.isAuthenticated.value"></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.account-layout {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1000px;
  }

  &__content {
    min-width: 0;

    @media (max-width: variables.$md) {
      width: 100%;
    }
  }

  &__menu {
    flex-shrink: 0;
    width: 240px;

    @media (max-width: variables.$md) {
      width: 100%;
    }
  }

  &__link {
    border-left: 3px solid transparent;
    color: var(--neutral-900);
    transition: background-color 300ms;

    &:hover {
      background-color: var(--primary-100);
    }

    &--current {
      border-left-color: var(--primary);
      background-color: var(--primary-100);
      color: var(--primary);
      font-weight: 700;
    }
  }

  &__icon {
    width: 20px;
    text-align: center;
  }
}
</style>
