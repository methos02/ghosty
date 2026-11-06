import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationCommentableLink from '@/views/layout/notifications/NotificationCommentableLink.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('NotificationCommentableLink.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('leads to the commented chapter, named by its title', () => {
    const notification = notificationSeeder.getCommentNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      1,
    )

    wrapper = mount(NotificationCommentableLink, { props: { notification } })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: notification.novel.slug, id: notification.chapter.id },
    })
    expect(link.text()).toBe(notification.chapter.title)
  })

  it('leads to the commented novel in a new tab when the notification has no chapter', () => {
    const notification = notificationSeeder.getNovelCommentNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      1,
    )

    wrapper = mount(NotificationCommentableLink, { props: { notification } })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toEqual({
      name: 'novel-detail',
      params: { slug: notification.novel.slug },
    })
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
    expect(link.text()).toBe(notification.novel.title)
  })
})
