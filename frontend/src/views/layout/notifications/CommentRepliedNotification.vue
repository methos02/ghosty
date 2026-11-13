<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <template v-if="notification.cover">
      <Translate
        v-if="notification.payload.count === 1"
        keypath="comment_replied_notification.cover.one"
      >
        <template #author>
          {{ notification.payload.lastActorUsername }}
        </template>
        <template #title>
          <NotificationCoverLink :notification="notification" />
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.count > 1"
        keypath="comment_replied_notification.cover.many"
      >
        <template #count>
          {{ notification.payload.count }}
        </template>
        <template #title>
          <NotificationCoverLink :notification="notification" />
        </template>
      </Translate>
    </template>
    <template v-else>
      <Translate
        v-if="notification.payload.count === 1"
        keypath="comment_replied_notification.one"
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
        keypath="comment_replied_notification.many"
      >
        <template #count>
          {{ notification.payload.count }}
        </template>
        <template #title>
          <NotificationCommentableLink :notification="notification" />
        </template>
      </Translate>
    </template>
  </NotificationBase>
</template>
