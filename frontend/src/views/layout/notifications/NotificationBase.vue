<script setup>
import { onMounted, ref } from 'vue'
import NotificationDetailByType from '@/views/layout/notifications/details/NotificationDetailByType.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { useHasInlineNotificationDetails } from '@/apis/notifications/composables/use-inline-notification-details.js'
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const props = defineProps({
  notification: { type: Object, required: true },
})

const { notificationStore } = useNotificationStore()
const hasInlineDetails = useHasInlineNotificationDetails()

const isDetailOpened = ref(
  hasInlineDetails && route.current().value.query.open === props.notification.id,
)
const detailPanel = ref()

const toggleDetail = () => {
  isDetailOpened.value = !isDetailOpened.value
}

const read = async () => {
  if (props.notification.isRead) {
    return
  }

  const response = await NotificationController.markAsRead(props.notification.id)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  notificationStore.markAsRead(props.notification.id)
  notificationStore.setUnreadCount(response.unreadCount)
}

const readWhenUsingALink = event => {
  if (!event.target.closest('a, button')) {
    return
  }

  read()
}

onMounted(() => {
  if (!isDetailOpened.value) {
    return
  }

  detailPanel.value.scrollIntoView({ block: 'center' })
})
</script>

<template>
  <div
    class="notification-base"
    :class="{ 'notification-base--unread': !notification.isRead }"
    @click="readWhenUsingALink"
  >
    <div class="notification-base__body | d-flex f-column g-5">
      <p class="notification-base__message | fs-400">
        <slot></slot>
      </p>
      <div class="notification-base__footer | d-flex j-between a-center g-10">
        <span class="notification-base__date | fs-300">
          {{ notification.updatedAtFormat }}
        </span>
        <button
          v-if="hasInlineDetails"
          type="button"
          class="notification-base__detail | d-flex a-center g-5 pointer fs-300"
          :aria-expanded="isDetailOpened"
          @click="toggleDetail"
        >
          {{ t(isDetailOpened ? 'notification_base.hide_detail' : 'notification_base.see_detail') }}
          <i
            class="notification-base__chevron | fa-solid fa-chevron-down"
            :class="{ 'notification-base__chevron--opened': isDetailOpened }"
          ></i>
        </button>
        <router-link
          v-if="!hasInlineDetails"
          :to="notificationRouteHelper.detail(notification)"
          class="notification-base__detail | d-flex a-center g-5 fs-300"
        >
          {{ t('notification_base.see_detail') }}
          <i class="notification-base__chevron | fa-solid fa-chevron-right"></i>
        </router-link>
      </div>
    </div>
    <div
      v-if="isDetailOpened"
      ref="detailPanel"
      class="notification-base__detail-panel | p-15"
    >
      <NotificationDetailByType :notification="notification" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification-base {
  border-left: 3px solid transparent;
  color: var(--neutral-900);

  &--unread {
    border-left-color: var(--primary);
    background-color: var(--primary-100);
  }

  &__body {
    padding: 12px 15px 12px 12px;
  }

  &__message {
    line-height: 1.5;
  }

  &__date {
    color: var(--neutral-600);
  }

  &__detail {
    padding: 3px 10px;
    border: none;
    border-radius: 999px;
    background-color: transparent;
    color: var(--primary-700);
    font-weight: 600;
    transition: background-color 200ms;

    &:hover {
      background-color: var(--primary-100);
    }
  }

  &--unread &__detail:hover {
    background-color: var(--neutral-100);
  }

  &__chevron {
    font-size: 10px;
    transition: transform 200ms;

    &--opened {
      transform: rotate(180deg);
    }
  }

  &__detail-panel {
    border-top: 1px solid var(--neutral-300);
    background-color: var(--neutral-200);
  }
}
</style>
