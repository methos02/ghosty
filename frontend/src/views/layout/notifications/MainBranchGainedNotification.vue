<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <NotificationBase :notification="notification">
    <Translate
      v-if="notification.payload.count === 1"
      keypath="main_branch_gained_notification.one"
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
      <template #novel>
        <router-link
          :to="notificationRouteHelper.novel(notification)"
          class="link-inline"
        >
          {{ notification.novel.title }}
        </router-link>
      </template>
    </Translate>
    <Translate
      v-if="notification.payload.count > 1"
      keypath="main_branch_gained_notification.many"
    >
      <template #count>
        {{ notification.payload.count }}
      </template>
      <template #novel>
        <router-link
          :to="notificationRouteHelper.novel(notification)"
          class="link-inline"
        >
          {{ notification.novel.title }}
        </router-link>
      </template>
    </Translate>
  </NotificationBase>
</template>
