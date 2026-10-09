import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NotificationsPage from '@/views/notifications/NotificationsPage.vue'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('NotificationsPage.vue', () => {
  let wrapper

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useNotificationStore().notificationStore.clear()
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('lists every notification of the reader', async () => {
    const listApi = notificationSeeder.getListApi({
      notifications: [
        notificationSeeder.getLikeReceivedApi(1, { id: 'like' }),
        notificationSeeder.getChapterContinuedApi(2, { id: 'continuation' }),
      ],
    })
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'notifications' })

    wrapper = mount(NotificationsPage)
    await flushPromises()

    expect(wrapper.findAll('.notifications-page__item')).toHaveLength(listApi.notifications.length)
    expect(wrapper.find('.notification-base__detail-panel').exists()).toBe(false)
  })

  it('opens the detail of the notification named in the address', async () => {
    const opened = notificationSeeder.getMainBranchMoveApi('main_branch_gained', 3, {
      id: 'opened',
    })
    const listApi = notificationSeeder.getListApi({
      notifications: [notificationSeeder.getLikeReceivedApi(1, { id: 'closed' }), opened],
    })
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'notifications', query: { open: opened.id } })

    wrapper = mount(NotificationsPage)
    await flushPromises()

    const details = wrapper.findAll('.notification-base__detail-panel')
    expect(details).toHaveLength(1)
    expect(details[0].findAll('.notification-chapter-list li')).toHaveLength(opened.data.count)
  })

  it('opens then closes the detail of a notification in place with the same button', async () => {
    const listApi = notificationSeeder.getListApi({
      notifications: [notificationSeeder.getLikeReceivedApi(1, { id: 'like' })],
    })
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    vi.spyOn(NotificationRepository, 'markAsRead').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getUnreadCountApi() }),
    )
    await router.push({ name: 'notifications' })
    wrapper = mount(NotificationsPage)
    await flushPromises()

    await wrapper.find('button.notification-base__detail').trigger('click')
    expect(wrapper.find('.notification-base__detail-panel').exists()).toBe(true)

    await wrapper.find('button.notification-base__detail').trigger('click')
    expect(wrapper.find('.notification-base__detail-panel').exists()).toBe(false)
  })

  it('tells the reader where notifications will show up when there is none', async () => {
    const listApi = notificationSeeder.getListApi({ notifications: [] })
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'notifications' })

    wrapper = mount(NotificationsPage)
    await flushPromises()

    expect(wrapper.find('.notifications-page__empty').exists()).toBe(true)
  })
})
