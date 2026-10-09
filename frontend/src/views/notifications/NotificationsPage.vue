<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import PaginatorInfinite from '@/components/paginators/PaginatorInfiniteComponent.vue'
import NotificationByType from '@/views/layout/notifications/NotificationByType.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { useInlineNotificationDetails } from '@/apis/notifications/composables/use-inline-notification-details.js'
import { useNotificationsHead } from '@/head/use-notifications-head.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useNotificationsHead()
useInlineNotificationDetails()

const { notifications, pagination, notificationStore } = useNotificationStore()

const isFirstPageLoaded = ref(false)

const loadPage = async page => {
  const response = await NotificationController.list(page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  notificationStore.addNotifications(response.inbox.notifications)
  notificationStore.setPagination(response.pagination)

  return response
}

const loadMore = async () => {
  if (!notificationStore.hasMore()) {
    return { status: STATUS.SUCCESS }
  }

  return await loadPage(pagination.value.nextPage)
}

onMounted(async () => {
  notificationStore.resetNotifications()
  await loadPage(1)
  isFirstPageLoaded.value = true
})
</script>

<template>
  <div class="notifications-page | f-column">
    <Header />

    <PaginatorInfinite
      v-if="isFirstPageLoaded"
      :cb="loadMore"
      :params="pagination"
      :options="{ observe: 'window' }"
    >
      <div class="notifications-page__body | w-xl py-40 px-20">
        <h1 class="fs-700 fw-700 mb-20">
          {{ t('notifications_page.title') }}
        </h1>

        <p
          v-if="notifications.length === 0"
          class="notifications-page__empty | color-neutral-700"
        >
          {{ t('notifications_page.empty') }}
        </p>

        <ul
          v-if="notifications.length > 0"
          class="notifications-page__list | d-flex f-column g-10"
        >
          <li
            v-for="notification in notifications"
            :key="notification.id"
            class="notifications-page__item"
          >
            <NotificationByType :notification="notification" />
          </li>
        </ul>
      </div>
    </PaginatorInfinite>
  </div>
</template>

<style lang="scss" scoped>
.notifications-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 900px;
  }

  &__item {
    overflow: hidden;
    border: 1px solid var(--neutral-400);
    border-radius: 10px;
    background-color: var(--neutral-100);
  }
}
</style>
