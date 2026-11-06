<script setup>
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <span class="notification-commentable-link">
    <NotificationChapterLink
      v-if="notification.chapter"
      :notification="notification"
      class="link-inline"
      :chapterId="notification.chapter.id"
    >
      {{ notification.chapter.title }}
    </NotificationChapterLink>
    <router-link
      v-else
      :to="notificationRouteHelper.novel(notification)"
      class="link-inline"
      target="_blank"
      rel="noopener"
    >
      {{ notification.novel.title }}
    </router-link>
  </span>
</template>
