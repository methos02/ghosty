<script setup>
import { ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { validateAccountEmailForm } from '@/apis/account/formRequest/account-email-form-request.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const authStore = useAuthStore()

const formDatas = ref({
  email: authStore.user.value.email,
})
const saveButton = ref()

const save = async () => {
  const validation = validateAccountEmailForm(formDatas.value)
  if (!validation.valid) {
    return
  }

  const response = await AccountController.updateEmail(formDatas.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  authStore.setUser(response.user)
  formDatas.value = {
    email: response.user.email,
  }
  flash.successT('account_email_section.saved')
}
</script>

<template>
  <section class="account-email-section | d-flex f-column g-15 bg-neutral-200 radius-10 p-20">
    <h2 class="fs-600 fw-700">
      {{ t('account_email_section.title') }}
    </h2>

    <form
      class="d-flex f-column g-10"
      @submit.prevent="saveButton.runCallback()"
    >
      <InputComponent
        v-model="formDatas.email"
        name="email"
        type="email"
        :label="t('account_email_section.email')"
        :required="true"
        autocomplete="email"
        form="accountEmail"
      />

      <InputComponent
        v-model="formDatas.currentPassword"
        name="currentPassword"
        type="password"
        :label="t('common.current_password')"
        :required="true"
        autocomplete="current-password"
        form="accountEmail"
      />

      <div class="d-flex j-end">
        <LoaderComponent
          ref="saveButton"
          :cb="save"
          buttonType="submit"
          buttonClasses="account-email-section__save | btn btn-primary"
        >
          {{ t('account_email_section.save') }}
        </LoaderComponent>
      </div>
    </form>
  </section>
</template>
