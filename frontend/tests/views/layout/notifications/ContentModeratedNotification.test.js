import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ContentModeratedNotification from '@/views/layout/notifications/ContentModeratedNotification.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('ContentModeratedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it.each([
    [RESOLUTIONS.ARCHIVED, 'content_moderated_notification.chapter.archived'],
    [RESOLUTIONS.HIDDEN, 'content_moderated_notification.chapter.hidden'],
    [RESOLUTIONS.PASSAGE_REMOVED, 'content_moderated_notification.chapter.passage_removed'],
    [RESOLUTIONS.DISMISSED, 'content_moderated_notification.chapter.sanctioned'],
  ])('tells the author their chapter was %s', (resolution, keypath) => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.CONTENT_MODERATED,
      { resolution },
    )

    wrapper = mount(ContentModeratedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t(keypath, { title: notification.chapter.title }),
    )
  })

  it.each([
    [RESOLUTIONS.HIDDEN, 'content_moderated_notification.comment.hidden'],
    [RESOLUTIONS.DISMISSED, 'content_moderated_notification.comment.sanctioned'],
  ])(
    'tells the author their comment was %s and names the commented chapter',
    (resolution, keypath) => {
      const notification = notificationSeeder.getModerationNotification(
        NOTIFICATION_TYPES.CONTENT_MODERATED,
        {
          content_type: REPORTED_CONTENT_TYPES.COMMENT,
          resolution,
        },
      )

      wrapper = mount(ContentModeratedNotification, { props: { notification } })

      expect(wrapper.find('.notification-base__message').text()).toBe(
        t(keypath, { title: notification.chapter.title }),
      )
    },
  )
})
