<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <template v-if="notification.payload.contentType === REPORTED_CONTENT_TYPES.CHAPTER">
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED"
        keypath="report_processed_notification.chapter.dismissed"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.ARCHIVED"
        keypath="report_processed_notification.chapter.archived"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.HIDDEN"
        keypath="report_processed_notification.chapter.hidden"
      >
        <template #title>
          <span class="report-processed-notification__title">{{ notification.chapter.title }}</span>
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.PASSAGE_REMOVED"
        keypath="report_processed_notification.chapter.passage_removed"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
    </template>
    <template v-if="notification.payload.contentType === REPORTED_CONTENT_TYPES.COMMENT">
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED"
        keypath="report_processed_notification.comment.dismissed"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.HIDDEN"
        keypath="report_processed_notification.comment.hidden"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
    </template>
  </NotificationBase>
</template>
