import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CommentReceivedNotificationDetail from '@/views/layout/notifications/details/CommentReceivedNotificationDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('CommentReceivedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('tells how many comments the chapter received and who wrote the last one', () => {
    const notification = notificationSeeder.getCommentNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      5,
    )

    wrapper = mount(CommentReceivedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('comment_received_notification_detail.comments.many', {
        title: notification.chapter.title,
        count: notification.payload.count,
      }),
    )
    expect(wrapper.text()).toContain(
      t('comment_received_notification_detail.last_author', {
        author: notification.payload.lastActorUsername,
      }),
    )
  })

  it('tells in the singular that the novel received a lone comment', () => {
    const notification = notificationSeeder.getNovelCommentNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      1,
    )

    wrapper = mount(CommentReceivedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('comment_received_notification_detail.comments.one', {
        title: notification.novel.title,
        count: notification.payload.count,
      }),
    )
  })

  it('tells what the cover received, leading to the covers page', () => {
    const notification = notificationSeeder.getCoverNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      2,
    )

    wrapper = mount(CommentReceivedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('comment_received_notification_detail.cover_comments.many', {
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
