import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationCoverLink from '@/views/layout/notifications/NotificationCoverLink.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('NotificationCoverLink.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the novel and opens its covers page in a new tab', () => {
    const notification = notificationSeeder.getCoverNotification(
      NOTIFICATION_TYPES.LIKE_RECEIVED,
      1,
    )

    wrapper = mount(NotificationCoverLink, { props: { notification } })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.text()).toBe(notification.novel.title)
    expect(link.props('to')).toEqual({
      name: 'novel-covers',
      params: { slug: notification.novel.slug },
    })
    expect(link.attributes('target')).toBe('_blank')
  })
})
