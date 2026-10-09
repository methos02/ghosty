<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import Dropdown from '@/components/DropdownComponent.vue'
import NotificationByType from '@/views/layout/notifications/NotificationByType.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { useLinkedNotificationDetails } from '@/apis/notifications/composables/use-inline-notification-details.js'
import { NOTIFICATION_BELL_LIMIT } from '@/constants/notification-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useLinkedNotificationDetails()

const authStore = useAuthStore()
const { bellNotifications, unreadCount, notificationStore } = useNotificationStore()

const latestNotifications = computed(() =>
  bellNotifications.value.slice(0, NOTIFICATION_BELL_LIMIT),
)

const refresh = async () => {
  const response = await NotificationController.list()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  notificationStore.setBellInbox(response.inbox)
}

const readAll = async () => {
  const response = await NotificationController.markAllAsRead()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  notificationStore.markAllAsRead()
  notificationStore.setUnreadCount(response.unreadCount)
}

onMounted(refresh)

onUnmounted(() => {
  if (authStore.isAuthenticated.value) {
    return
  }

  notificationStore.clear()
})
</script>

<template>
  <Dropdown
    orientation="right"
    @show="refresh"
  >
    <template #button>
      <button
        type="button"
        class="notification-bell | pointer d-flex a-center color-neutral-100"
        :aria-label="t('notification_bell.open', unreadCount)"
      >
        <i class="notification-bell__icon | fa-regular fa-bell"></i>
        <span
          v-if="unreadCount > 0"
          class="notification-bell__badge | d-flex a-center j-center"
        >
          {{ unreadCount }}
        </span>
      </button>
    </template>

    <template #items>
      <div class="notification-bell__panel | d-flex f-column">
        <div class="notification-bell__header | d-flex j-between a-center g-10">
          <span class="notification-bell__title">
            {{ t('notification_bell.title') }}
          </span>
          <button
            v-if="unreadCount > 0"
            type="button"
            class="notification-bell__read-all | pointer fs-300"
            @click="readAll"
          >
            {{ t('notification_bell.read_all') }}
          </button>
        </div>

        <p
          v-if="bellNotifications.length === 0"
          class="notification-bell__empty | fs-400"
        >
          {{ t('notification_bell.empty') }}
        </p>

        <ul
          v-if="bellNotifications.length > 0"
          class="notification-bell__list | d-flex f-column"
        >
          <li
            v-for="notification in latestNotifications"
            :key="notification.id"
          >
            <NotificationByType :notification="notification" />
          </li>
        </ul>

        <router-link
          :to="{ name: 'notifications' }"
          class="notification-bell__see-all | fs-300"
        >
          {{ t('notification_bell.see_all') }}
        </router-link>
      </div>
    </template>
  </Dropdown>
</template>

<style lang="scss" scoped>
.notification-bell {
  position: relative;
  border: none;
  background-color: transparent;
  padding: 0 5px;

  &__icon {
    font-size: var(--fs-icon-400);
    transition: color 300ms;
  }

  &:hover &__icon {
    color: var(--primary);
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 9px;
    background-color: var(--primary);
    color: var(--neutral-100);
    font-size: 11px;
    font-weight: 700;
  }

  &__panel {
    width: min(380px, 90vw);
    max-height: 420px;
    overflow-y: auto;
    color: var(--neutral-900);
  }

  &__header {
    padding: 10px 15px;
    border-bottom: 1px solid var(--neutral-400);
  }

  &__title {
    font-weight: 700;
  }

  &__read-all {
    border: none;
    background-color: transparent;
    color: var(--primary);
    text-decoration: underline;
  }

  &__empty {
    padding: 15px;
    color: var(--neutral-700);
  }

  &__list {
    gap: 8px;
    padding: 8px;
    background-color: var(--neutral-200);
  }

  &__list > li {
    overflow: hidden;
    border: 1px solid var(--neutral-400);
    border-radius: 8px;
    background-color: var(--neutral-100);
  }

  &__see-all {
    padding: 10px 15px;
    border-top: 1px solid var(--neutral-400);
    color: var(--primary);
    text-align: center;
    text-decoration: underline;
  }
}
</style>
