<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import NotificationChapterList from '@/views/layout/notifications/details/NotificationChapterList.vue'
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="main-branch-lost-detail | d-flex f-column g-10">
    <Translate
      keypath="main_branch_lost_detail.chapters"
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
    <p>
      {{ t('main_branch_lost_detail.promote') }}
    </p>
    <NotificationChapterLink
      :notification="notification"
      :chapterId="notification.chapter.id"
      class="main-branch-lost-detail__read | btn btn-sm btn-primary-alt"
    >
      {{ t('main_branch_lost_detail.read_branch') }}
    </NotificationChapterLink>
  </div>
</template>
