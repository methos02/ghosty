<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="comment-replied-notification-detail | d-flex f-column g-10">
    <Translate
      v-if="notification.payload.count === 1"
      keypath="comment_replied_notification_detail.replies.one"
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
      keypath="comment_replied_notification_detail.replies.many"
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
      keypath="comment_replied_notification_detail.last_author"
      tag="p"
    >
      <template #author>
        {{ notification.payload.lastActorUsername }}
      </template>
    </Translate>
  </div>
</template>
