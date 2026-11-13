import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LikeReceivedNotificationDetail from '@/views/layout/notifications/details/LikeReceivedNotificationDetail.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'

describe('LikeReceivedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('tells how many supports the chapter received and who gave the last one', () => {
    const notification = notificationSeeder.getLikeReceived(12)

    wrapper = mount(LikeReceivedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('like_received_notification_detail.supports.many', {
        title: notification.chapter.title,
        count: notification.payload.count,
      }),
    )
    expect(wrapper.text()).toContain(
      t('like_received_notification_detail.last_reader', {
        author: notification.payload.lastActorUsername,
      }),
    )
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: notification.novel.slug, id: notification.chapter.id },
    })
  })

  it('tells what the cover received, leading to the covers page', () => {
    const notification = notificationSeeder.getCoverNotification(
      NOTIFICATION_TYPES.LIKE_RECEIVED,
      2,
    )

    wrapper = mount(LikeReceivedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('like_received_notification_detail.cover_supports.many', {
        title: notification.novel.title,
        count: notification.payload.count,
      }),
    )
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'novel-covers',
      params: { slug: notification.novel.slug },
    })
  })
})
