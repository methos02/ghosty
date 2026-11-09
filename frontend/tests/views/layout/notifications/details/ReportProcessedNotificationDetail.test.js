import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ReportProcessedNotificationDetail from '@/views/layout/notifications/details/ReportProcessedNotificationDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('ReportProcessedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('tells the reporter no infringement was found and that the report stays anonymous', () => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.REPORT_PROCESSED,
      { resolution: RESOLUTIONS.DISMISSED },
    )

    wrapper = mount(ReportProcessedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(t('report_processed_notification_detail.dismissed'))
    expect(wrapper.text()).toContain(t('report_processed_notification_detail.anonymous'))
  })

  it('tells the reporter a decision was taken on the reported content', () => {
    const notification = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.REPORT_PROCESSED,
      { resolution: RESOLUTIONS.PASSAGE_REMOVED },
    )

    wrapper = mount(ReportProcessedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(t('report_processed_notification_detail.acted'))
    expect(wrapper.text()).not.toContain(t('report_processed_notification_detail.dismissed'))
  })
})
