<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <template v-if="notification.cover">
      <Translate
        v-if="notification.payload.count === 1"
        keypath="like_received_notification.cover.one"
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
        keypath="like_received_notification.cover.many"
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
        keypath="like_received_notification.one"
      >
        <template #author>
          {{ notification.payload.lastActorUsername }}
        </template>
        <template #title>
          <NotificationChapterLink
            :notification="notification"
            class="link-inline"
            :chapterId="notification.chapter.id"
          >
            {{ notification.chapter.title }}
          </NotificationChapterLink>
        </template>
      </Translate>
      <Translate
        v-if="notification.payload.count > 1"
        keypath="like_received_notification.many"
      >
        <template #count>
          {{ notification.payload.count }}
        </template>
        <template #title>
          <NotificationChapterLink
            :notification="notification"
            class="link-inline"
            :chapterId="notification.chapter.id"
          >
            {{ notification.chapter.title }}
          </NotificationChapterLink>
        </template>
      </Translate>
    </template>
  </NotificationBase>
</template>
