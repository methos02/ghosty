<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="comment-received-notification-detail | d-flex f-column g-10">
    <template v-if="notification.cover">
      <Translate
        v-if="notification.payload.count === 1"
        keypath="comment_received_notification_detail.cover_comments.one"
        tag="p"
      >
        <template #title>
          <NotificationCoverLink :notification="notification" />
        </template>
        <template #count>
          {{ notification.payload.count }}
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.count > 1"
        keypath="comment_received_notification_detail.cover_comments.many"
        tag="p"
      >
        <template #title>
          <NotificationCoverLink :notification="notification" />
        </template>
        <template #count>
          {{ notification.payload.count }}
        </template>
      </Translate>
    </template>
    <template v-else>
      <Translate
        v-if="notification.payload.count === 1"
        keypath="comment_received_notification_detail.comments.one"
        tag="p"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
        <template #count>
          {{ notification.payload.count }}
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.count > 1"
        keypath="comment_received_notification_detail.comments.many"
        tag="p"
      >
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
        <template #count>
          {{ notification.payload.count }}
        </template>
      </Translate>
    </template>
    <Translate
      keypath="comment_received_notification_detail.last_author"
      tag="p"
    >
      <template #author>
        {{ notification.payload.lastActorUsername }}
      </template>
    </Translate>
  </div>
</template>
