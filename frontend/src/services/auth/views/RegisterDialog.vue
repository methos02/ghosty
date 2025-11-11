<script setup>
import { ref, watch } from 'vue'
import { auth, t, form } from '@/services/services-helper.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'
import DialogComponent from '@/components/DialogComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import { useAuth } from '../src/useAuth.js'
import { validateRegisterForm } from '../formRequest/register-form-request.js'

const authDialogs = useAuth()

const datas = ref({})
const dialog = ref()
const registerButton = ref()

watch(() => authDialogs.showRegisterDialog.value, (show) => {
  dialog.value.toggle(show)
  if (show) { form.clearErrors() }
})

const handleRegister = async () => {
  form.clearErrors()

  const validation = validateRegisterForm(datas.value)
  if (!validation.valid) { return }

  const response = await auth.register(datas.value)
  if (response.status !== STATUS.SUCCESS) { return }

  authDialogs.closeDialogs()
}

const switchToLogin = () => {
  authDialogs.openLoginDialog()
}

const close = () => {
  authDialogs.closeRegisterDialog()
}
</script>

<template>
  <DialogComponent
    ref="dialog"
    :title="t('auth.register_title')"
    @dialog-close="close"
  >
    <div class="register-dialog__body | w-full">
      <form @submit.prevent="registerButton.runCallback()" class="d-flex f-column">
        <div class="form-row">
          <InputComponent
            v-model="datas.pseudo"
            name="pseudo"
            type="text"
            :label="t('auth.register_pseudo')"
            :required="true"
            autocomplete="username"
          />
        </div>

        <div class="form-row">
          <InputComponent
            v-model="datas.email"
            name="email"
            type="email"
            :label="t('auth.register_email')"
            :required="true"
            autocomplete="email"
          />
        </div>

        <div class="form-row">
          <InputComponent
            v-model="datas.password"
            name="password"
            type="password"
            :label="t('auth.register_password')"
            :required="true"
            autocomplete="new-password"
          />
        </div>

        <div class="form-row">
          <InputComponent
            v-model="datas.passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            :label="t('auth.register_password_confirmation')"
            :required="true"
            autocomplete="new-password"
          />
        </div>

        <div class="form-row">
          <div class="register-dialog__terms">
            <label class="d-flex a-start g-10 pointer">
              <input v-model="datas.acceptTerms" type="checkbox" class="register-dialog__checkbox | pointer mt-5" />
              <span class="register-dialog__terms-text | fs-400">
                {{ t('auth.register_terms') }}
              </span>
            </label>
          </div>
        </div>

        <div class="form-row">
          <div class="d-flex g-20">
            <LoaderComponent
              ref="registerButton"
              :cb="handleRegister"
              button-type="submit"
              button-classes="btn btn-primary flex-1"
            >
              {{ t('auth.register_button') }}
            </LoaderComponent>
            <button
              type="button"
              @click="switchToLogin"
              class="btn btn-primary-alt | flex-1"
            >
              {{ t('auth.login_switch') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.register-dialog {
  &__body {
    width: 100vw;
    max-width: 450px;
  }

  &__terms {
    height: 48px;
    position: relative;
  }

  &__checkbox {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__terms-text {
    font-size: 16px;
    line-height: 24px;
    color: #4a5565;
  }

  &__error {
    border: 1px solid var(--danger);
  }
}
</style>
