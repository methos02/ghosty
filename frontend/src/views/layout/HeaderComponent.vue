<script setup>
import { ref } from 'vue'
import HeaderSideMenu from '@/views/layout/HeaderSideMenu.vue'
import NotificationBell from '@/views/layout/NotificationBell.vue'
import LoginDialog from '@/services/auth/views/LoginDialog.vue'
import RegisterDialog from '@/services/auth/views/RegisterDialog.vue'
import ChapterSummaryDialog from '@/views/chapters/parts/ChapterSummaryDialog.vue'
import ReportDialog from '@/views/reports/ReportDialog.vue'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

defineProps({
  transparent: { type: Boolean, default: false },
})

const authDialogs = useAuth()
const authStore = useAuthStore()

const isMenuOpen = ref(false)
</script>

<template>
  <header
    class="header | d-flex j-between a-center py-5"
    :class="{ 'header--transparent': transparent, 'header--menu-open': isMenuOpen }"
  >
    <div class="header-right">
      <router-link
        to="/"
        class="d-flex a-center g-5"
      >
        <img
          src="@/assets/images/logo-mini.png"
          alt="Logo"
          class="header-logo"
        />
        <p class="header-title">
          <span class="title-left">Ghos</span>
          <span class="title-right">TY</span>
        </p>
      </router-link>
    </div>

    <div class="header-left | d-flex a-center g-25">
      <div
        v-if="authStore.isAuthenticated.value"
        class="header-menu | d-flex a-center g-15 color-neutral-100"
      >
        <NotificationBell />
        <router-link
          :to="{ name: 'profile', params: { profileSlug: authStore.user.value.profileSlug } }"
          class="header-username | fs-500 color-neutral-100 color-primary-hover"
        >
          {{ authStore.user.value.username }}
        </router-link>
        <HeaderSideMenu v-model:open="isMenuOpen" />
      </div>

      <template v-if="!authStore.isAuthenticated.value">
        <button
          @click="authDialogs.openLoginDialog()"
          class="btn-auth | btn btn-neutral-100 py-5"
        >
          {{ t('header.login') }}
        </button>
        <button
          @click="authDialogs.openRegisterDialog()"
          class="btn-auth | btn btn-neutral-100 py-5"
        >
          {{ t('header.register') }}
        </button>
      </template>
    </div>
  </header>

  <LoginDialog />
  <RegisterDialog />
  <ChapterSummaryDialog />
  <ReportDialog />
</template>

<style lang="scss">
@use '@/assets/scss/variables';

.header {
  height: 60px;
  padding-inline: 5%;

  position: relative;
  z-index: 51;
  background-color: var(--secondary);
  transition: background-color 300ms;

  &--transparent {
    background-color: transparent;
  }

  &--menu-open {
    background-color: var(--secondary);
  }

  &-logo {
    width: 50px;
    height: 50px;
  }

  .title-left {
    font-family: lobsterTwo, sans-serif;
    color: var(--neutral-100);
    font-size: var(--h1-fs);
  }

  .title-right {
    font-weight: 700;
    color: var(--primary);
    font-size: var(--h1-fs);
  }

  .btn-auth {
    width: 130px;
    min-height: 38px;

    @media (max-width: variables.$sm) {
      width: auto;
      padding-inline: 15px;
    }
  }

  &-left {
    @media (max-width: variables.$sm) {
      gap: 10px;
    }
  }

  &-title {
    @media (max-width: variables.$sm) {
      display: none;
    }
  }

  &-username {
    font-weight: 500;
    transition: color 300ms;
  }
}
</style>
