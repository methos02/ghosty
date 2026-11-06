import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CommentRepliedNotificationDetail from '@/views/layout/notifications/details/CommentRepliedNotificationDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('CommentRepliedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('tells how many replies the comments on the chapter received and who wrote the last one', () => {
    const notification = notificationSeeder.getCommentNotification(
      NOTIFICATION_TYPES.COMMENT_REPLIED,
      4,
    )

    wrapper = mount(CommentRepliedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('comment_replied_notification_detail.replies.many', {
        title: notification.chapter.title,
        count: notification.payload.count,
      }),
    )
    expect(wrapper.text()).toContain(
      t('comment_replied_notification_detail.last_author', {
        author: notification.payload.lastActorUsername,
      }),
    )
  })

  it('tells in the singular that comments on the novel received a lone reply', () => {
    const notification = notificationSeeder.getNovelCommentNotification(
      NOTIFICATION_TYPES.COMMENT_REPLIED,
      1,
    )

    wrapper = mount(CommentRepliedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('comment_replied_notification_detail.replies.one', {
        title: notification.novel.title,
        count: notification.payload.count,
      }),
    )
  })
})
