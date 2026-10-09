import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { NOTIFICATION_BELL_LIMIT } from '@/constants/notification-constants.js'
import NotificationBell from '@/views/layout/NotificationBell.vue'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { useInlineNotificationDetails } from '@/apis/notifications/composables/use-inline-notification-details.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
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
    const listApi = notificationSeeder.getListApi({ unread_count: 3 })
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.find('.notification-bell__badge').text()).toBe(String(listApi.unread_count))
  })

  it('hides the badge when everything has been read', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi({ unread_count: 0 }) }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.find('.notification-bell__badge').exists()).toBe(false)
  })

  it('fetches the inbox again when the reader opens it', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-bell').trigger('click')
    await flushPromises()

    expect(NotificationRepository.list).toHaveBeenCalledTimes(2)
  })

  it('renders each notification through the component of its type, unread ones set apart', async () => {
    const listApi = notificationSeeder.getListApi()
    const [notification] = NotificationDto.fromList(listApi).notifications
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
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
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
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
      notificationSeeder.getNotificationApi({ id: `notification-${index}` }),
    )
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi({ notifications }) }),
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
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({
        data: notificationSeeder.getListApi({ notifications: [], unread_count: 0 }),
      }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    expect(wrapper.find('.notification-bell__empty').exists()).toBe(true)
    expect(wrapper.find('.notification-bell__list').exists()).toBe(false)
  })

  it('marks a notification read once one of its links is followed, keeping the count the api returned', async () => {
    const notificationApi = notificationSeeder.getNotificationApi()
    const unreadCountApi = notificationSeeder.getUnreadCountApi({ unread_count: 1 })
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({
        data: notificationSeeder.getListApi({ notifications: [notificationApi], unread_count: 2 }),
      }),
    )
    vi.spyOn(NotificationRepository, 'markAsRead').mockResolvedValue(
      controllerSuccess({ data: unreadCountApi }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-base__detail').trigger('click')
    await flushPromises()

    expect(NotificationRepository.markAsRead).toHaveBeenCalledWith({
      params: NotificationDto.toReadParams(notificationApi.id),
    })
    expect(wrapper.find('.notification-bell__badge').text()).toBe(
      String(unreadCountApi.unread_count),
    )
    expect(wrapper.find('.notification-base').classes()).not.toContain('notification-base--unread')
  })

  it('does not call the api again for a notification already read', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({
        data: notificationSeeder.getListApi({
          notifications: [notificationSeeder.getNotificationApi({ is_read: true })],
          unread_count: 0,
        }),
      }),
    )
    vi.spyOn(NotificationRepository, 'markAsRead')
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-base__detail').trigger('click')
    await flushPromises()

    expect(NotificationRepository.markAsRead).not.toHaveBeenCalled()
  })

  it('marks the whole inbox read in one go', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi({ unread_count: 1 }) }),
    )
    vi.spyOn(NotificationRepository, 'markAllAsRead').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getUnreadCountApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    await wrapper.find('.notification-bell__read-all').trigger('click')
    await flushPromises()

    expect(wrapper.find('.notification-bell__badge').exists()).toBe(false)
    expect(wrapper.find('.notification-base--unread').exists()).toBe(false)
  })

  it('forgets the inbox once the reader has logged out', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi({ unread_count: 3 }) }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NotificationBell)
    await flushPromises()

    useAuthStore().clear()
    wrapper.unmount()
    wrapper = undefined

    expect(useNotificationStore().unreadCount.value).toBe(0)
  })
})
