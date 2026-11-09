import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import NotificationSanction from '@/views/layout/notifications/details/NotificationSanction.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { SANCTION_TYPES } from '@/constants/moderation-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('NotificationSanction.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('announces a warning', () => {
    const { sanction } = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.CONTENT_MODERATED,
      {
        sanction: notificationSeeder.getSanctionApi({ type: SANCTION_TYPES.WARNING, until: null }),
      },
    ).payload

    wrapper = mount(NotificationSanction, { props: { sanction } })

    expect(wrapper.find('.notification-sanction__sentence').text()).toBe(
      t('notification_sanction.warning'),
    )
  })

  it('tells the author why they are sanctioned', () => {
    const { sanction } = notificationSeeder.getModerationNotification(
      NOTIFICATION_TYPES.CONTENT_MODERATED,
      { sanction: notificationSeeder.getSanctionApi() },
    ).payload

    wrapper = mount(NotificationSanction, { props: { sanction } })

    expect(wrapper.find('.notification-sanction__reason').text()).toBe(
      t('notification_sanction.reason', { reason: sanction.reason }),
    )
  })

  it.each([SANCTION_TYPES.WRITE_BAN, SANCTION_TYPES.COMMENT_BAN, SANCTION_TYPES.ACCOUNT_BAN])(
    'announces a %s with its end date',
    type => {
      const { sanction } = notificationSeeder.getModerationNotification(
        NOTIFICATION_TYPES.CONTENT_MODERATED,
        { sanction: notificationSeeder.getSanctionApi({ type }) },
      ).payload

      wrapper = mount(NotificationSanction, { props: { sanction } })

      expect(wrapper.find('.notification-sanction__sentence').text()).toBe(
        t(`notification_sanction.${type}.until`, { date: sanction.untilFormat }),
      )
    },
  )

  it.each([SANCTION_TYPES.WRITE_BAN, SANCTION_TYPES.COMMENT_BAN, SANCTION_TYPES.ACCOUNT_BAN])(
    'announces a permanent %s',
    type => {
      const { sanction } = notificationSeeder.getModerationNotification(
        NOTIFICATION_TYPES.CONTENT_MODERATED,
        { sanction: notificationSeeder.getSanctionApi({ type, until: null }) },
      ).payload

      wrapper = mount(NotificationSanction, { props: { sanction } })

      expect(wrapper.find('.notification-sanction__sentence').text()).toBe(
        t(`notification_sanction.${type}.permanent`),
      )
    },
  )
})
