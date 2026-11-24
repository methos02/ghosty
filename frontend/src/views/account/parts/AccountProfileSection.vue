<script setup>
import { onUnmounted, ref, watch } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import AccountAvatarSection from '@/views/account/parts/AccountAvatarSection.vue'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { validateAccountProfileForm } from '@/apis/account/formRequest/account-profile-form-request.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { USERNAME_AVAILABILITY } from '@/constants/account-constants.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const authStore = useAuthStore()

const formDatas = ref({ username: authStore.user.value.username })
const usernameAvailability = ref()
const saveButton = ref()
const avatarSection = ref()
const state = { availabilityTimerId: undefined }

const checkAvailability = async username => {
  const response = await AccountController.checkUsernameAvailability(username)
  if (username !== formDatas.value.username) {
    return
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    usernameAvailability.value = undefined
    return
  }

  usernameAvailability.value = response.isAvailable
    ? USERNAME_AVAILABILITY.AVAILABLE
    : USERNAME_AVAILABILITY.TAKEN
}

const scheduleAvailabilityCheck = username => {
  clearTimeout(state.availabilityTimerId)
  usernameAvailability.value = undefined

  if (username.trim() === '' || username === authStore.user.value.username) {
    return
  }

  usernameAvailability.value = USERNAME_AVAILABILITY.CHECKING
  state.availabilityTimerId = setTimeout(
    () => checkAvailability(username),
    ConfigLoader.get('account.usernameCheckDelay'),
  )
}

const save = async () => {
  const validation = validateAccountProfileForm(formDatas.value)
  if (!validation.valid) {
    return
  }

  const formData = { ...formDatas.value }
  if (avatarSection.value.hasPendingImage()) {
    formData.image = await avatarSection.value.renderPendingImage()
  }

  const response = await AccountController.updateProfile(formData)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  avatarSection.value.release()
  authStore.setUser(response.user)
  formDatas.value = { username: response.user.username }
  flash.successT('account_profile_section.saved')
}

watch(() => formDatas.value.username, scheduleAvailabilityCheck)

onUnmounted(() => {
  clearTimeout(state.availabilityTimerId)
})
</script>

<template>
  <section class="account-profile-section | d-flex f-column g-15 bg-neutral-200 radius-10 p-20">
    <h2 class="fs-600 fw-700">
      {{ t('account_profile_section.title') }}
    </h2>

    <div class="d-flex a-start g-30 f-column-md">
      <AccountAvatarSection
        ref="avatarSection"
        class="account-profile-section__avatar"
      />

      <form
        class="account-profile-section__form | flex-1 d-flex f-column g-10"
        @submit.prevent="saveButton.runCallback()"
      >
        <div class="d-flex f-column g-5">
          <InputComponent
            v-model="formDatas.username"
            name="username"
            :label="t('account_profile_section.username')"
            :required="true"
            autocomplete="username"
            form="accountProfile"
          />
          <p
            v-if="usernameAvailability === USERNAME_AVAILABILITY.CHECKING"
            class="account-profile-section__availability | fs-300 color-neutral-700"
          >
            {{ t('account_profile_section.username_checking') }}
          </p>
          <p
            v-else-if="usernameAvailability === USERNAME_AVAILABILITY.AVAILABLE"
            class="account-profile-section__availability account-profile-section__availability--available | fs-300 color-primary"
          >
            {{ t('account_profile_section.username_available') }}
          </p>
          <p
            v-else-if="usernameAvailability === USERNAME_AVAILABILITY.TAKEN"
            class="account-profile-section__availability account-profile-section__availability--taken | fs-300 color-danger"
          >
            {{ t('account_profile_section.username_taken') }}
          </p>
        </div>
      </form>
    </div>

    <div class="d-flex j-end">
      <LoaderComponent
        ref="saveButton"
        :cb="save"
        :disabled="usernameAvailability === USERNAME_AVAILABILITY.TAKEN"
        buttonClasses="account-profile-section__save | btn btn-primary"
      >
        {{ t('account_profile_section.save') }}
      </LoaderComponent>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.account-profile-section {
  &__avatar {
    flex-shrink: 0;
    width: 220px;

    @media (max-width: variables.$md) {
      width: 100%;
    }
  }

  &__form {
    min-width: 0;

    @media (max-width: variables.$md) {
      width: 100%;
    }
  }
}
</style>
