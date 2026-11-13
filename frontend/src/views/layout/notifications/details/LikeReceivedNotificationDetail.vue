<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="like-received-notification-detail | d-flex f-column g-10">
    <template v-if="notification.cover">
      <Translate
        v-if="notification.payload.count === 1"
        keypath="like_received_notification_detail.cover_supports.one"
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
        keypath="like_received_notification_detail.cover_supports.many"
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
        keypath="like_received_notification_detail.supports.one"
        tag="p"
      >
        <template #title>
          <NotificationChapterLink
            :notification="notification"
            class="link-inline"
            :chapterId="notification.chapter.id"
          >
            {{ notification.chapter.title }}
          </NotificationChapterLink>
        </template>
        <template #count>
          {{ notification.payload.count }}
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.count > 1"
        keypath="like_received_notification_detail.supports.many"
        tag="p"
      >
        <template #title>
          <NotificationChapterLink
            :notification="notification"
            class="link-inline"
            :chapterId="notification.chapter.id"
          >
            {{ notification.chapter.title }}
          </NotificationChapterLink>
        </template>
        <template #count>
          {{ notification.payload.count }}
        </template>
      </Translate>
    </template>
    <Translate
      keypath="like_received_notification_detail.last_reader"
      tag="p"
    >
      <template #author>
        {{ notification.payload.lastActorUsername }}
      </template>
    </Translate>
  </div>
</template>
