<script setup>
import { computed, ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import SwitchComponent from '@/services/form/views/inputs/SwitchComponent.vue'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { NOTIFICATION_PREFERENCE_GROUPS } from '@/constants/notification-constants.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const authStore = useAuthStore()

const formDatas = ref({ types: { ...authStore.user.value.notificationPreferences } })

const isAnyTypeEnabled = computed({
  get: () => Object.values(formDatas.value.types).includes(true),
  set: isEnabled => {
    for (const type of Object.keys(formDatas.value.types)) {
      formDatas.value.types[type] = isEnabled
    }
  },
})

const save = async () => {
  const response = await AccountController.updateNotifications(formDatas.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  authStore.setUser(response.user)
  formDatas.value = { types: { ...response.user.notificationPreferences } }
  flash.successT('account_notifications_section.saved')
}
</script>

<template>
  <section
    class="account-notifications-section | d-flex f-column g-15 bg-neutral-200 radius-10 p-20"
  >
    <h2 class="fs-600 fw-700">
      {{ t('account_notifications_section.title') }}
    </h2>

    <SwitchComponent
      v-model="isAnyTypeEnabled"
      name="notificationsEnabled"
      :suffix="t('account_notifications_section.all')"
      form="accountNotifications"
      class="account-notifications-section__all"
    />

    <div class="account-notifications-section__groups | d-flex f-column g-20">
      <div
        v-for="(types, group) in NOTIFICATION_PREFERENCE_GROUPS"
        :key="group"
        class="account-notifications-section__group | d-flex f-column g-10"
      >
        <h3 class="fs-400 fw-700 color-neutral-700">
          {{ t(`account_notifications_section.groups.${group}`) }}
        </h3>

        <ul class="account-notifications-section__types | d-flex f-column g-10">
          <li
            v-for="type in types"
            :key="type"
          >
            <SwitchComponent
              v-model="formDatas.types[type]"
              :name="`types.${type}`"
              :suffix="t(`account_notifications_section.types.${type}`)"
              form="accountNotifications"
            />
          </li>
        </ul>
      </div>
    </div>

    <p class="account-notifications-section__always | fs-300 color-neutral-700">
      {{ t('account_notifications_section.always_sent') }}
    </p>

    <div class="d-flex j-end">
      <LoaderComponent
        :cb="save"
        buttonClasses="account-notifications-section__save | btn btn-primary"
      >
        {{ t('account_notifications_section.save') }}
      </LoaderComponent>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.account-notifications-section__groups {
  padding-left: 20px;
}
</style>
