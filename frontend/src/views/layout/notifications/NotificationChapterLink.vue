<script setup>
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'

defineProps({
  notification: { type: Object, required: true },
  chapterId: { type: Number, required: true },
})
</script>

<template>
  <router-link
    :to="notificationRouteHelper.chapter(notification, chapterId)"
    target="_blank"
    rel="noopener"
  >
    <slot></slot>
  </router-link>
</template>
