import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LikeReceivedNotification from '@/views/layout/notifications/LikeReceivedNotification.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('LikeReceivedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the reader behind a lone support, the chapter title leading to the chapter', () => {
    const notification = notificationSeeder.getLikeReceived(1)

    wrapper = mount(LikeReceivedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('like_received_notification.one', {
        author: notification.payload.lastActorUsername,
        title: notification.chapter.title,
      }),
    )
    expect(message.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: notification.novel.slug, id: notification.chapter.id },
    })
  })

  it('counts the readers once supports have gathered', () => {
    const notification = notificationSeeder.getLikeReceived(12)

    wrapper = mount(LikeReceivedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t('like_received_notification.many', {
        count: notification.payload.count,
        title: notification.chapter.title,
      }),
    )
  })
})
