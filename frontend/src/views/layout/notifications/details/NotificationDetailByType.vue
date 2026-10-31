<script setup>
import ChapterContinuedDetail from '@/views/layout/notifications/details/ChapterContinuedDetail.vue'
import MainBranchGainedDetail from '@/views/layout/notifications/details/MainBranchGainedDetail.vue'
import MainBranchLostDetail from '@/views/layout/notifications/details/MainBranchLostDetail.vue'
import FollowedBranchExtendedDetail from '@/views/layout/notifications/details/FollowedBranchExtendedDetail.vue'
import LikeReceivedDetail from '@/views/layout/notifications/details/LikeReceivedDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="notification-detail-by-type">
    <ChapterContinuedDetail
      v-if="notification.type === NOTIFICATION_TYPES.CHAPTER_CONTINUED"
      :notification="notification"
    />
    <MainBranchGainedDetail
      v-if="notification.type === NOTIFICATION_TYPES.MAIN_BRANCH_GAINED"
      :notification="notification"
    />
    <MainBranchLostDetail
      v-if="notification.type === NOTIFICATION_TYPES.MAIN_BRANCH_LOST"
      :notification="notification"
    />
    <FollowedBranchExtendedDetail
      v-if="notification.type === NOTIFICATION_TYPES.FOLLOWED_BRANCH_EXTENDED"
      :notification="notification"
    />
    <LikeReceivedDetail
      v-if="notification.type === NOTIFICATION_TYPES.LIKE_RECEIVED"
      :notification="notification"
    />
  </div>
</template>
