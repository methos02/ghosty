import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CommentRepliedNotification from '@/views/layout/notifications/CommentRepliedNotification.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('CommentRepliedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the reader behind a lone reply and the chapter of the answered comment', () => {
    const notification = notificationSeeder.getCommentNotification(
      NOTIFICATION_TYPES.COMMENT_REPLIED,
      1,
    )

    wrapper = mount(CommentRepliedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t('comment_replied_notification.one', {
        author: notification.payload.lastActorUsername,
        title: notification.chapter.title,
      }),
    )
  })

  it('counts the replies gathered on comments of a novel and names the novel', () => {
    const notification = notificationSeeder.getNovelCommentNotification(
      NOTIFICATION_TYPES.COMMENT_REPLIED,
      4,
    )

    wrapper = mount(CommentRepliedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t('comment_replied_notification.many', {
        count: notification.payload.count,
        title: notification.novel.title,
      }),
    )
  })
})
