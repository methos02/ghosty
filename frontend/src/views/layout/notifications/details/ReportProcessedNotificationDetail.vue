<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="report-processed-notification-detail | d-flex f-column g-10">
    <p v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED">
      {{ t('report_processed_notification_detail.dismissed') }}
    </p>
    <p v-else>
      {{ t('report_processed_notification_detail.acted') }}
    </p>
    <p>{{ t('report_processed_notification_detail.anonymous') }}</p>
  </div>
</template>
