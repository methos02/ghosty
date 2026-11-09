<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import { SANCTION_TYPES } from '@/constants/moderation-constants.js'

defineProps({
  sanction: { type: Object, required: true },
})
</script>

<template>
  <div class="notification-sanction | d-flex f-column g-5">
    <p class="notification-sanction__sentence | fw-500">
      <template v-if="sanction.type === SANCTION_TYPES.WARNING">
        {{ t('notification_sanction.warning') }}
      </template>
      <template v-if="sanction.type === SANCTION_TYPES.WRITE_BAN && !sanction.isPermanent">
        {{ t('notification_sanction.write_ban.until', { date: sanction.untilFormat }) }}
      </template>
      <template v-if="sanction.type === SANCTION_TYPES.WRITE_BAN && sanction.isPermanent">
        {{ t('notification_sanction.write_ban.permanent') }}
      </template>
      <template v-if="sanction.type === SANCTION_TYPES.COMMENT_BAN && !sanction.isPermanent">
        {{ t('notification_sanction.comment_ban.until', { date: sanction.untilFormat }) }}
      </template>
      <template v-if="sanction.type === SANCTION_TYPES.COMMENT_BAN && sanction.isPermanent">
        {{ t('notification_sanction.comment_ban.permanent') }}
      </template>
      <template v-if="sanction.type === SANCTION_TYPES.ACCOUNT_BAN && !sanction.isPermanent">
        {{ t('notification_sanction.account_ban.until', { date: sanction.untilFormat }) }}
      </template>
      <template v-if="sanction.type === SANCTION_TYPES.ACCOUNT_BAN && sanction.isPermanent">
        {{ t('notification_sanction.account_ban.permanent') }}
      </template>
    </p>
    <p class="notification-sanction__reason | fs-300">
      {{ t('notification_sanction.reason', { reason: sanction.reason }) }}
    </p>
  </div>
</template>
