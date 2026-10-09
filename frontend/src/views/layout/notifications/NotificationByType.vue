<script setup>
import ChapterContinuedNotification from '@/views/layout/notifications/ChapterContinuedNotification.vue'
import MainBranchGainedNotification from '@/views/layout/notifications/MainBranchGainedNotification.vue'
import MainBranchLostNotification from '@/views/layout/notifications/MainBranchLostNotification.vue'
import LikeReceivedNotification from '@/views/layout/notifications/LikeReceivedNotification.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="notification-by-type">
    <ChapterContinuedNotification
      v-if="notification.type === NOTIFICATION_TYPES.CHAPTER_CONTINUED"
      :notification="notification"
    />
    <MainBranchGainedNotification
      v-if="notification.type === NOTIFICATION_TYPES.MAIN_BRANCH_GAINED"
      :notification="notification"
    />
    <MainBranchLostNotification
      v-if="notification.type === NOTIFICATION_TYPES.MAIN_BRANCH_LOST"
      :notification="notification"
    />
    <LikeReceivedNotification
      v-if="notification.type === NOTIFICATION_TYPES.LIKE_RECEIVED"
      :notification="notification"
    />
  </div>
</template>
