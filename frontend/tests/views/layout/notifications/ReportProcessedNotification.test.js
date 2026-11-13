import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ReportProcessedNotification from '@/views/layout/notifications/ReportProcessedNotification.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('ReportProcessedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it.each([
    [RESOLUTIONS.DISMISSED, 'report_processed_notification.chapter.dismissed'],
    [RESOLUTIONS.ARCHIVED, 'report_processed_notification.chapter.archived'],
    [RESOLUTIONS.PASSAGE_REMOVED, 'report_processed_notification.chapter.passage_removed'],
  ])('tells the reporter the reported chapter was %s', (resolution, keypath) => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.REPORT_PROCESSED,
      { resolution },
    )

    wrapper = mount(ReportProcessedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t(keypath, { title: notification.chapter.title }),
    )
  })

  it('names a hidden chapter without linking to it', () => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.REPORT_PROCESSED,
      { resolution: RESOLUTIONS.HIDDEN },
    )

    wrapper = mount(ReportProcessedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t('report_processed_notification.chapter.hidden', { title: notification.chapter.title }),
    )
    expect(wrapper.find('.notification-commentable-link').exists()).toBe(false)
  })

  it.each([
    [RESOLUTIONS.DISMISSED, 'report_processed_notification.comment.dismissed'],
    [RESOLUTIONS.HIDDEN, 'report_processed_notification.comment.hidden'],
  ])('tells the reporter the reported comment was %s', (resolution, keypath) => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.REPORT_PROCESSED,
      {
        content_type: REPORTED_CONTENT_TYPES.COMMENT,
        resolution,
      },
    )

    wrapper = mount(ReportProcessedNotification, { props: { notification } })

    expect(wrapper.find('.notification-base__message').text()).toBe(
      t(keypath, { title: notification.chapter.title }),
    )
  })

  it.each([
    [RESOLUTIONS.DISMISSED, 'report_processed_notification.cover.dismissed'],
    [RESOLUTIONS.HIDDEN, 'report_processed_notification.cover.hidden'],
  ])('tells about the cover of the novel when the decision is %s', (resolution, keypath) => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.REPORT_PROCESSED,
      {
        content_type: REPORTED_CONTENT_TYPES.COVER,
        chapter: null,
        cover: notificationSeeder.getCoverNotificationApi(NOTIFICATION_TYPES.REPORT_PROCESSED, 1)
          .cover,
        resolution,
      },
    )

    wrapper = mount(ReportProcessedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(t(keypath, { title: notification.novel.title }))
    expect(message.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'novel-covers',
      params: { slug: notification.novel.slug },
    })
  })
})
