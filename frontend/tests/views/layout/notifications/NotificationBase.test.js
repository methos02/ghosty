import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import NotificationBase from '@/views/layout/notifications/NotificationBase.vue'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { useInlineNotificationDetails } from '@/apis/notifications/composables/use-inline-notification-details.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('NotificationBase.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useNotificationStore().notificationStore.clear()
    vi.clearAllMocks()
  })

  it('offers the same detail link on every notification', () => {
    const notification = notificationSeeder.getNotification()

    wrapper = mount(NotificationBase, { props: { notification } })

    const detail = wrapper.findComponent('.notification-base__detail')
    expect(detail.text()).toBe(t('notification_base.see_detail'))
    expect(detail.props('to')).toEqual({ name: 'notifications', query: { open: notification.id } })
  })

  it('turns the detail link into a toggle where the detail can open in place', async () => {
    const notification = notificationSeeder.getNotification({ isRead: true })
    const PageWithDetailToggle = defineComponent({
      setup() {
        useInlineNotificationDetails()
        return () => h(NotificationBase, { notification })
      },
    })

    wrapper = mount(PageWithDetailToggle)
    await wrapper.find('button.notification-base__detail').trigger('click')

    const toggleButton = wrapper.find('button.notification-base__detail')
    expect(toggleButton.text()).toBe(t('notification_base.hide_detail'))
    expect(toggleButton.attributes('aria-expanded')).toBe('true')
  })

  it('marks the notification read when one of its links is followed', async () => {
    const notification = notificationSeeder.getNotification()
    vi.spyOn(NotificationRepository, 'markAsRead').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getUnreadCountApi() }),
    )

    wrapper = mount(NotificationBase, {
      props: { notification },
      slots: { default: '<a href="/chapitre">Le phare</a>' },
    })
    await wrapper.find('.notification-base__message a').trigger('click')
    await flushPromises()

    expect(NotificationRepository.markAsRead).toHaveBeenCalledWith({
      params: NotificationDto.toReadParams(notification.id),
    })
  })

  it('leaves the notification unread when the reader clicks beside its links', async () => {
    vi.spyOn(NotificationRepository, 'markAsRead')

    wrapper = mount(NotificationBase, {
      props: { notification: notificationSeeder.getNotification() },
    })
    await wrapper.find('.notification-base__date').trigger('click')
    await flushPromises()

    expect(NotificationRepository.markAsRead).not.toHaveBeenCalled()
  })
})
