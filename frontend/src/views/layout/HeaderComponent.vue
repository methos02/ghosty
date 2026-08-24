<script setup>
import { ref } from 'vue'
import HeaderSideMenu from '@/views/layout/HeaderSideMenu.vue'
import LoginDialog from '@/services/auth/views/LoginDialog.vue'
import RegisterDialog from '@/services/auth/views/RegisterDialog.vue'
import ChapterSummaryDialog from '@/views/chapters/parts/ChapterSummaryDialog.vue'
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
        <p>
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
        <span class="header-username | fs-500">{{ authStore.user.value?.username }}</span>
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
</template>

<style lang="scss">
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
  }

  &-username {
    font-weight: 500;
  }
}
</style>
