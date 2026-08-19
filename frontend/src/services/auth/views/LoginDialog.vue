<script setup>
import { ref, watch } from 'vue'
import { auth, t, form } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import DialogComponent from '@/components/DialogComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import ErrorFormComponent from '@/services/form/views/ErrorFormComponent.vue'
import { useAuth } from '../src/use-auth.js'
import { validateLoginForm } from '../formRequest/login-form-request.js'

const authDialogs = useAuth()

const datas = ref({})
const dialog = ref()
const loginButton = ref()

watch(
  () => authDialogs.showLoginDialog.value,
  show => {
    dialog.value.toggle(show)
    if (show) {
      form.clearErrors()
    }
  },
)

const handleLogin = async () => {
  form.clearErrors()

  const validation = validateLoginForm(datas.value)
  if (!validation.valid) {
    return
  }

  const response = await auth.login(datas.value)
  if (response.status !== STATUS.SUCCESS) {
    form.addError('login.unauthorize', 'auth.login_error_token')
    return
  }

  authDialogs.closeDialogs()
}

const switchToRegister = () => {
  authDialogs.openRegisterDialog()
}

const close = () => {
  authDialogs.closeLoginDialog()
}
</script>

<template>
  <DialogComponent
    ref="dialog"
    :title="t('auth.login_title')"
    @dialog-close="close"
  >
    <div class="login-dialog__body | w-full">
      <form
        @submit.prevent="loginButton?.runCallback()"
        class="d-flex f-column"
      >
        <div class="form-row">
          <InputComponent
            v-model="datas.identifier"
            name="identifier"
            type="text"
            :label="t('auth.login_identifier')"
            :required="true"
            autocomplete="username"
            form="login"
          />
        </div>

        <div class="form-row">
          <InputComponent
            v-model="datas.password"
            name="password"
            type="password"
            :label="t('auth.login_password')"
            :required="true"
            autocomplete="current-password"
            form="login"
          />
        </div>

        <div class="form-row">
          <ErrorFormComponent name="login.unauthorize" />
        </div>

        <div class="form-row">
          <div class="d-flex g-20">
            <LoaderComponent
              ref="loginButton"
              :cb="handleLogin"
              buttonType="submit"
              buttonClasses="btn btn-primary flex-1"
            >
              {{ t('auth.login_button') }}
            </LoaderComponent>
            <button
              type="button"
              @click="switchToRegister"
              class="btn btn-primary-alt | flex-1"
            >
              {{ t('auth.register_switch') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.login-dialog {
  &__body {
    width: 100vw;
    max-width: 450px;
  }

  &__error {
    border: 1px solid var(--danger);
  }
}
</style>
