<script setup>
import Input from '@brugmann/vuemann/src/services/form/views/inputs/InputComponent.vue'
import Loader from "@brugmann/vuemann/src/components/LoaderComponent.vue";
import { useAuthStore } from '@brugmann/vuemann/src/services/auth/auth-store.js'
import { authFunctions } from '@brugmann/vuemann/src/services/auth/src/auth-functions.js'
import { storeToRefs } from 'pinia'
import { t } from '@brugmann/vuemann/src/services/services-helper'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { ref } from 'vue'

const authStore = useAuthStore()
const { username, password, errorAuth } = storeToRefs(authStore)

const loader = ref()
const login = async () => {
  const response = await authFunctions.login(username.value, password.value)
  loader.value.setLoad(response)
  password.value = undefined
  if(response === false) { return }

  await servicesM.service('router:redirectAfterLogin')
}
</script>
<template>
  <div class="container-login | d-flex">
    <div class="w-full d-flex j-center p-relative">
      <img :src="`/images/vuemann/brugmann.webp`" class="login-image | image-responsive" />
    </div>
    <div class="login-side">
      <div class="login-card | p-relative p-20">
        <h1 class="login-title | h1 color-primary text-center mb-25">{{ t('login_title') }}</h1>
        <form
          id="login-form"
          class="login-form | f-column g-20 px-15 mb-15"
          @submit.prevent="loader.runCallBack"
        >
          <p
            id="login-error"
            v-if="errorAuth !== undefined"
            class="color-danger mb-15"
          >
            {{ t(errorAuth) }}
          </p>
          <Input 
            name="username" 
            label="Username"
            v-model="username" 
          />
          <Input
            name="password"
            :label="t('login_password')"
            :type="'password'"
            v-model="password"
          />
          <div class="d-flex j-center">
            <Loader
              buttonType="submit"
              buttonClasses="login-button | btn btn-primary"
              ref="loader"
              :cb="login"
              :infinite="true"
            >
              {{ t('login_button') }}
            </Loader>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.container-login {
  height: calc(100dvh - 100px);

  .login {
    &-side { 
      padding-top: 15vh; 
      margin-left: 10vw;
      width: 25vw;
      flex-shrink: 0;
    }
    &-card { 
      width: 350px; 
      margin-inline: auto;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background-color: white;
        opacity: 0.8;
        border-radius: 10px;
      }
    }
    &-form, &-title { 
      position: relative;
      z-index: 1;  
    }
    &-title {
      font-size: 2.4rem;
    }
    &-button {
      width: 100%;
      font-size: 1.5rem;
      padding: 5px;
    }
    &-image {
      position: fixed;
      inset: 0;
    }
  }
}
</style>
