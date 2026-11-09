<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import NotificationSanction from '@/views/layout/notifications/details/NotificationSanction.vue'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="content-moderated-notification-detail | d-flex f-column g-10">
    <p v-if="notification.payload.resolution === RESOLUTIONS.ARCHIVED">
      {{ t('content_moderated_notification_detail.archived') }}
    </p>
    <p v-if="notification.payload.resolution === RESOLUTIONS.HIDDEN">
      {{ t('content_moderated_notification_detail.hidden') }}
    </p>
    <p v-if="notification.payload.resolution === RESOLUTIONS.PASSAGE_REMOVED">
      {{ t('content_moderated_notification_detail.passage_removed') }}
    </p>
    <p v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED">
      {{ t('content_moderated_notification_detail.dismissed') }}
    </p>
    <NotificationSanction
      v-if="notification.payload.sanction"
      :sanction="notification.payload.sanction"
    />
  </div>
</template>
