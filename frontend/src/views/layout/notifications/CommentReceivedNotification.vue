<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <Translate
      v-if="notification.payload.count === 1"
      keypath="comment_received_notification.one"
    >
      <template #author>
        {{ notification.payload.lastActorUsername }}
      </template>
      <template #title>
        <NotificationCommentableLink :notification="notification" />
      </template>
    </Translate>
    <Translate
      v-if="notification.payload.count > 1"
      keypath="comment_received_notification.many"
    >
      <template #count>
        {{ notification.payload.count }}
      </template>
      <template #title>
        <NotificationCommentableLink :notification="notification" />
      </template>
    </Translate>
  </NotificationBase>
</template>
