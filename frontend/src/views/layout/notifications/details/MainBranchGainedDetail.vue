<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterList from '@/views/layout/notifications/details/NotificationChapterList.vue'
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="main-branch-gained-detail | d-flex f-column g-10">
    <Translate
      keypath="main_branch_gained_detail.chapters"
      tag="p"
    >
      <template #novel>
        <router-link
          :to="notificationRouteHelper.novel(notification)"
          class="link-inline"
        >
          {{ notification.novel.title }}
        </router-link>
      </template>
    </Translate>
    <NotificationChapterList :notification="notification" />
  </div>
</template>
