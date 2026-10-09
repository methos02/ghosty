import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { NOTIFICATION_BELL_LIMIT } from '@/constants/notification-constants.js'
import NotificationBell from '@/views/layout/NotificationBell.vue'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { useInlineNotificationDetails } from '@/apis/notifications/composables/use-inline-notification-details.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('NotificationBell.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useNotificationStore().notificationStore.clear()
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  it('fetches the inbox as soon as the page loads and shows the unread count', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({ unreadCount: 3 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.find('.notification-bell__badge').text()).toBe('3')
  })

  it('hides the badge when everything has been read', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({ unreadCount: 0 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.find('.notification-bell__badge').exists()).toBe(false)
  })

  it('fetches the inbox again when the reader opens it', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox(),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-bell').trigger('click')
    await flushPromises()

    expect(NotificationController.list).toHaveBeenCalledTimes(2)
  })

  it('renders each notification through the component of its type, unread ones set apart', async () => {
    const inbox = notificationSeeder.getInbox()
    const [notification] = inbox.notifications
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox,
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    const item = wrapper.find('.notification-base')
    expect(item.text()).toContain(
      t('like_received_notification.one', {
        author: notification.payload.lastActorUsername,
        title: notification.chapter.title,
      }),
    )
    expect(item.classes()).toContain('notification-base--unread')
  })

  it('keeps leading to the notifications page even inside a page that opens details in place', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue(
      controllerSuccess({ inbox: notificationSeeder.getInbox() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const PageWithInlineDetails = defineComponent({
      setup() {
        useInlineNotificationDetails()
        return () => h(NotificationBell)
      },
    })

    wrapper = mount(PageWithInlineDetails)
    await flushPromises()

    expect(wrapper.find('button.notification-base__detail').exists()).toBe(false)
    expect(wrapper.find('a.notification-base__detail').exists()).toBe(true)
  })

  it('shows only the latest notifications and leads to all of them', async () => {
    const notifications = Array.from({ length: NOTIFICATION_BELL_LIMIT + 2 }, (_, index) =>
      notificationSeeder.getNotification({ id: `notification-${index}` }),
    )
    vi.spyOn(NotificationController, 'list').mockResolvedValue(
      controllerSuccess({ inbox: notificationSeeder.getInbox({ notifications }) }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.findAll('.notification-base')).toHaveLength(NOTIFICATION_BELL_LIMIT)
    expect(wrapper.findComponent('.notification-bell__see-all').props('to')).toEqual({
      name: 'notifications',
    })
  })

  it('tells the reader where notifications will show up when there is none', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({ notifications: [], unreadCount: 0 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.find('.notification-bell__empty').exists()).toBe(true)
    expect(wrapper.find('.notification-bell__list').exists()).toBe(false)
  })

  it('marks a notification read once one of its links is followed, keeping the count the api returned', async () => {
    const notification = notificationSeeder.getNotification()
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({ notifications: [notification], unreadCount: 2 }),
    })
    vi.spyOn(NotificationController, 'markAsRead').mockResolvedValue({
      status: STATUS.SUCCESS,
      unreadCount: 1,
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-base__detail').trigger('click')
    await flushPromises()

    expect(NotificationController.markAsRead).toHaveBeenCalledWith(notification.id)
    expect(wrapper.find('.notification-bell__badge').text()).toBe('1')
    expect(wrapper.find('.notification-base').classes()).not.toContain('notification-base--unread')
  })

  it('does not call the api again for a notification already read', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({
        notifications: [notificationSeeder.getNotification({ isRead: true })],
        unreadCount: 0,
      }),
    })
    vi.spyOn(NotificationController, 'markAsRead')
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-base__detail').trigger('click')
    await flushPromises()

    expect(NotificationController.markAsRead).not.toHaveBeenCalled()
  })

  it('marks the whole inbox read in one go', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({ unreadCount: 1 }),
    })
    vi.spyOn(NotificationController, 'markAllAsRead').mockResolvedValue({
      status: STATUS.SUCCESS,
      unreadCount: 0,
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-bell__read-all').trigger('click')
    await flushPromises()

    expect(wrapper.find('.notification-bell__badge').exists()).toBe(false)
    expect(wrapper.find('.notification-base--unread').exists()).toBe(false)
  })

  it('forgets the inbox once the reader has logged out', async () => {
    vi.spyOn(NotificationController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      inbox: notificationSeeder.getInbox({ unreadCount: 3 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    useAuthStore().clear()
    wrapper.unmount()
    wrapper = undefined

    expect(useNotificationStore().unreadCount.value).toBe(0)
  })
})
