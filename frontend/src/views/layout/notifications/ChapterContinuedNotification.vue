<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <Translate
      v-if="notification.payload.count === 1"
      keypath="chapter_continued_notification.one"
    >
      <template #author>
        {{ notification.payload.continuation.authorUsername }}
      </template>
      <template #continuation>
        <NotificationChapterLink
          :notification="notification"
          class="link-inline"
          :chapterId="notification.payload.continuation.id"
        >
          {{ notification.payload.continuation.title }}
        </NotificationChapterLink>
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
      keypath="chapter_continued_notification.many"
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
  </NotificationBase>
</template>
