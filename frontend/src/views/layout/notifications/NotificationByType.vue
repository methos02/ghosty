<script setup>
import ChapterContinuedNotification from '@/views/layout/notifications/ChapterContinuedNotification.vue'
import MainBranchGainedNotification from '@/views/layout/notifications/MainBranchGainedNotification.vue'
import MainBranchLostNotification from '@/views/layout/notifications/MainBranchLostNotification.vue'
import FollowedBranchExtendedNotification from '@/views/layout/notifications/FollowedBranchExtendedNotification.vue'
import LikeReceivedNotification from '@/views/layout/notifications/LikeReceivedNotification.vue'
import CommentReceivedNotification from '@/views/layout/notifications/CommentReceivedNotification.vue'
import CommentRepliedNotification from '@/views/layout/notifications/CommentRepliedNotification.vue'
import ContentModeratedNotification from '@/views/layout/notifications/ContentModeratedNotification.vue'
import ReportProcessedNotification from '@/views/layout/notifications/ReportProcessedNotification.vue'
import CoverSelectedNotification from '@/views/layout/notifications/CoverSelectedNotification.vue'
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
    <FollowedBranchExtendedNotification
      v-if="notification.type === NOTIFICATION_TYPES.FOLLOWED_BRANCH_EXTENDED"
      :notification="notification"
    />
    <LikeReceivedNotification
      v-if="notification.type === NOTIFICATION_TYPES.LIKE_RECEIVED"
      :notification="notification"
    />
    <CommentReceivedNotification
      v-if="notification.type === NOTIFICATION_TYPES.COMMENT_RECEIVED"
      :notification="notification"
    />
    <CommentRepliedNotification
      v-if="notification.type === NOTIFICATION_TYPES.COMMENT_REPLIED"
      :notification="notification"
    />
    <ContentModeratedNotification
      v-if="notification.type === NOTIFICATION_TYPES.CONTENT_MODERATED"
      :notification="notification"
    />
    <ReportProcessedNotification
      v-if="notification.type === NOTIFICATION_TYPES.REPORT_PROCESSED"
      :notification="notification"
    />
    <CoverSelectedNotification
      v-if="notification.type === NOTIFICATION_TYPES.COVER_SELECTED"
      :notification="notification"
    />
  </div>
</template>
