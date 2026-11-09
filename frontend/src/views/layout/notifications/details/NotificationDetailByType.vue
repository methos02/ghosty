<script setup>
import ChapterContinuedNotificationDetail from '@/views/layout/notifications/details/ChapterContinuedNotificationDetail.vue'
import MainBranchGainedNotificationDetail from '@/views/layout/notifications/details/MainBranchGainedNotificationDetail.vue'
import MainBranchLostNotificationDetail from '@/views/layout/notifications/details/MainBranchLostNotificationDetail.vue'
import FollowedBranchExtendedNotificationDetail from '@/views/layout/notifications/details/FollowedBranchExtendedNotificationDetail.vue'
import LikeReceivedNotificationDetail from '@/views/layout/notifications/details/LikeReceivedNotificationDetail.vue'
import CommentReceivedNotificationDetail from '@/views/layout/notifications/details/CommentReceivedNotificationDetail.vue'
import CommentRepliedNotificationDetail from '@/views/layout/notifications/details/CommentRepliedNotificationDetail.vue'
import ContentModeratedNotificationDetail from '@/views/layout/notifications/details/ContentModeratedNotificationDetail.vue'
import ReportProcessedNotificationDetail from '@/views/layout/notifications/details/ReportProcessedNotificationDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="notification-detail-by-type">
    <ChapterContinuedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.CHAPTER_CONTINUED"
      :notification="notification"
    />
    <MainBranchGainedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.MAIN_BRANCH_GAINED"
      :notification="notification"
    />
    <MainBranchLostNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.MAIN_BRANCH_LOST"
      :notification="notification"
    />
    <FollowedBranchExtendedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.FOLLOWED_BRANCH_EXTENDED"
      :notification="notification"
    />
    <LikeReceivedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.LIKE_RECEIVED"
      :notification="notification"
    />
    <CommentReceivedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.COMMENT_RECEIVED"
      :notification="notification"
    />
    <CommentRepliedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.COMMENT_REPLIED"
      :notification="notification"
    />
    <ContentModeratedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.CONTENT_MODERATED"
      :notification="notification"
    />
    <ReportProcessedNotificationDetail
      v-if="notification.type === NOTIFICATION_TYPES.REPORT_PROCESSED"
      :notification="notification"
    />
  </div>
</template>
