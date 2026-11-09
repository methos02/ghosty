import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ContentModeratedNotificationDetail from '@/views/layout/notifications/details/ContentModeratedNotificationDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('ContentModeratedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('explains what a passage removal changed and shows no sanction when none was given', () => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.CONTENT_MODERATED,
      { resolution: RESOLUTIONS.PASSAGE_REMOVED },
    )

    wrapper = mount(ContentModeratedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toBe(t('content_moderated_notification_detail.passage_removed'))
    expect(wrapper.find('.notification-sanction').exists()).toBe(false)
  })

  it('adds the sanction given along with the decision', () => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.CONTENT_MODERATED,
      {
        resolution: RESOLUTIONS.HIDDEN,
        sanction: notificationSeeder.getSanctionApi(),
      },
    )

    wrapper = mount(ContentModeratedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(t('content_moderated_notification_detail.hidden'))
    expect(wrapper.find('.notification-sanction__sentence').text()).toBe(
      t('notification_sanction.write_ban.until', {
        date: notification.payload.sanction.untilFormat,
      }),
    )
  })
})
