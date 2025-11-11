<script setup>
import LoginDialog from '@/services/auth/views/LoginDialog.vue'
import RegisterDialog from '@/services/auth/views/RegisterDialog.vue'
import { useAuth } from '@/services/auth/src/useAuth.js'
import { auth } from '@/services/services-helper.js'
import { authStore } from '@/services/auth/src/auth-store.js'

const authDialogs = useAuth()

const handleLogout = async () => {
  await auth.logout()
}
</script>

<template>
  <header class="header | d-flex j-between a-center py-5">
    <div class="header-right">
      <router-link to="/" class="d-flex a-center g-5">
        <img
          src="@/assets/images/logo-mini.png"
          alt="Logo"
          class="header-logo"
        >
        <p>
          <span class="title-left">Ghos</span>
          <span class="title-right">TY</span>
        </p>
      </router-link>
    </div>
    <div class="header-left | d-flex g-25">
      <template v-if="authStore.isAuthenticated.value">
        <span class="header-username | color-neutral-100 fs-500">
          {{ authStore.user.value?.pseudo }}
        </span>
        <button @click="handleLogout" class="btn-auth | btn btn-neutral-100 py-10">
          Déconnexion
        </button>
      </template>
      <template v-if="!authStore.isAuthenticated.value">
        <button @click="authDialogs.openLoginDialog()" class="btn-auth | btn btn-neutral-100 py-10">
          Connexion
        </button>
        <button @click="authDialogs.openRegisterDialog()" class="btn-auth | btn btn-neutral-100 py-10">
          Inscription
        </button>
      </template>
    </div>
  </header>

  <LoginDialog />
  <RegisterDialog />
</template>

<style lang="scss">
.header {
  padding-inline: 5%;

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
    width: 150px;
  }

  &-username {
    display: flex;
    align-items: center;
    font-weight: 500;
  }
}
</style>
