import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CommentReceivedNotification from '@/views/layout/notifications/CommentReceivedNotification.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('CommentReceivedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the reader behind a lone comment and the commented chapter', () => {
    const notification = notificationSeeder.getCommentNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      1,
    )

    wrapper = mount(CommentReceivedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t('comment_received_notification.one', {
        author: notification.payload.lastActorUsername,
        title: notification.chapter.title,
      }),
    )
  })

  it('counts the comments gathered on a novel and names the novel', () => {
    const notification = notificationSeeder.getNovelCommentNotification(
      NOTIFICATION_TYPES.COMMENT_RECEIVED,
      5,
    )

    wrapper = mount(CommentReceivedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t('comment_received_notification.many', {
        count: notification.payload.count,
        title: notification.novel.title,
      }),
    )
  })
})
