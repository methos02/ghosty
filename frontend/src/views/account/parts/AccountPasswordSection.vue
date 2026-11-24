<script setup>
import { ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { validateAccountPasswordForm } from '@/apis/account/formRequest/account-password-form-request.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const formDatas = ref({})
const saveButton = ref()

const save = async () => {
  const validation = validateAccountPasswordForm(formDatas.value)
  if (!validation.valid) {
    return
  }

  const response = await AccountController.updatePassword(formDatas.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  formDatas.value = {}
  flash.successT('account_password_section.saved')
}
</script>

<template>
  <section class="account-password-section | d-flex f-column g-15 bg-neutral-200 radius-10 p-20">
    <h2 class="fs-600 fw-700">
      {{ t('account_password_section.title') }}
    </h2>

    <form
      class="d-flex f-column g-10"
      @submit.prevent="saveButton.runCallback()"
    >
      <InputComponent
        v-model="formDatas.currentPassword"
        name="currentPassword"
        type="password"
        :label="t('common.current_password')"
        :required="true"
        autocomplete="current-password"
        form="accountPassword"
      />

      <InputComponent
        v-model="formDatas.password"
        name="password"
        type="password"
        :label="t('account_password_section.password')"
        :required="true"
        autocomplete="new-password"
        form="accountPassword"
      />

      <InputComponent
        v-model="formDatas.passwordConfirmation"
        name="passwordConfirmation"
        type="password"
        :label="t('account_password_section.password_confirmation')"
        :required="true"
        autocomplete="new-password"
        form="accountPassword"
      />

      <div class="d-flex j-end">
        <LoaderComponent
          ref="saveButton"
          :cb="save"
          buttonType="submit"
          buttonClasses="account-password-section__save | btn btn-primary"
        >
          {{ t('account_password_section.save') }}
        </LoaderComponent>
      </div>
    </form>
  </section>
</template>
