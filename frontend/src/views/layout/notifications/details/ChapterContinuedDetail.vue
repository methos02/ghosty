<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="chapter-continued-detail | d-flex f-column g-10">
    <Translate
      v-if="notification.payload.count === 1"
      keypath="chapter_continued_detail.continuations.one"
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
      keypath="chapter_continued_detail.continuations.many"
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
      keypath="chapter_continued_detail.latest"
      tag="p"
    >
      <template #continuation>
        <NotificationChapterLink
          :notification="notification"
          class="link-inline"
          :chapterId="notification.payload.continuation.id"
        >
          {{ notification.payload.continuation.title }}
        </NotificationChapterLink>
      </template>
      <template #author>
        {{ notification.payload.continuation.authorUsername }}
      </template>
    </Translate>
  </div>
</template>
