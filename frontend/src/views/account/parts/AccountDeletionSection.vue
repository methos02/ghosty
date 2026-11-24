<script setup>
import { ref } from 'vue'
import { flash, router, t } from '@/services/shortcuts/services-shortcut.js'
import ConfirmButtonComponent from '@/components/ConfirmButtonComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { validateAccountDeletionForm } from '@/apis/account/formRequest/account-deletion-form-request.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const authStore = useAuthStore()

const formDatas = ref({})

const deleteAccount = async () => {
  const validation = validateAccountDeletionForm(formDatas.value)
  if (!validation.valid) {
    return
  }

  const response = await AccountController.destroy(formDatas.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  authStore.clear()
  flash.successT('account_deletion_section.deleted')
  await router.push({ name: 'home' })
}
</script>

<template>
  <section class="account-deletion-section | d-flex f-column g-15 radius-10 p-20 border-danger">
    <h2 class="fs-600 fw-700 color-danger">
      {{ t('account_deletion_section.title') }}
    </h2>

    <p class="fs-400 color-neutral-700">
      {{ t('account_deletion_section.warning') }}
    </p>

    <form
      class="d-flex f-column g-10"
      @submit.prevent
    >
      <InputComponent
        v-model="formDatas.currentPassword"
        name="currentPassword"
        type="password"
        :label="t('common.current_password')"
        :required="true"
        autocomplete="current-password"
        form="accountDeletion"
      />

      <div class="d-flex j-end">
        <ConfirmButtonComponent
          :cb="deleteAccount"
          :question="t('account_deletion_section.confirm')"
          buttonClasses="account-deletion-section__delete | btn btn-danger"
        >
          {{ t('account_deletion_section.delete') }}
        </ConfirmButtonComponent>
      </div>
    </form>
  </section>
</template>
