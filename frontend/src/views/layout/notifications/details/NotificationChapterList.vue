<script setup>
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <ul class="notification-chapter-list | d-flex f-column g-5">
    <li
      v-for="chapter in notification.payload.chapters"
      :key="chapter.id"
    >
      <NotificationChapterLink
        :notification="notification"
        class="link-inline"
        :chapterId="chapter.id"
      >
        {{ chapter.title }}
      </NotificationChapterLink>
    </li>
  </ul>
</template>
