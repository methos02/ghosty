<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <Translate keypath="cover_selected_notification.message">
      <template #title>
        <NotificationCoverLink :notification="notification" />
      </template>
    </Translate>
  </NotificationBase>
</template>
