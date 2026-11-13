<script setup>
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <router-link
    :to="notificationRouteHelper.covers(notification)"
    class="notification-cover-link | link-inline"
    target="_blank"
    rel="noopener"
  >
    {{ notification.novel.title }}
  </router-link>
</template>
