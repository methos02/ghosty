import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationChapterLink from '@/views/layout/notifications/NotificationChapterLink.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('NotificationChapterLink.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('opens the chapter of the notification in a new tab', () => {
    const notification = notificationSeeder.getNotification()

    wrapper = mount(NotificationChapterLink, {
      props: { notification, chapterId: notification.chapter.id },
      slots: { default: notification.chapter.title },
    })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: notification.novel.slug, id: notification.chapter.id },
    })
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
    expect(link.text()).toBe(notification.chapter.title)
  })
})
