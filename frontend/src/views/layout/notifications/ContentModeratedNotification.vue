<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <template v-if="notification.payload.contentType === REPORTED_CONTENT_TYPES.CHAPTER">
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.ARCHIVED"
        keypath="content_moderated_notification.chapter.archived"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.HIDDEN"
        keypath="content_moderated_notification.chapter.hidden"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.PASSAGE_REMOVED"
        keypath="content_moderated_notification.chapter.passage_removed"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED"
        keypath="content_moderated_notification.chapter.sanctioned"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
    </template>
    <template v-if="notification.payload.contentType === REPORTED_CONTENT_TYPES.COMMENT">
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.HIDDEN"
        keypath="content_moderated_notification.comment.hidden"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED"
        keypath="content_moderated_notification.comment.sanctioned"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
    </template>
    <template v-if="notification.payload.contentType === REPORTED_CONTENT_TYPES.COVER">
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.HIDDEN"
        keypath="content_moderated_notification.cover.hidden"
      >
        <template #title>
          <NotificationCoverLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.resolution === RESOLUTIONS.DISMISSED"
        keypath="content_moderated_notification.cover.sanctioned"
      >
        <template #title>
          <NotificationCoverLink :notification="notification" />
        </template>
      </Translate>
    </template>
  </NotificationBase>
</template>
