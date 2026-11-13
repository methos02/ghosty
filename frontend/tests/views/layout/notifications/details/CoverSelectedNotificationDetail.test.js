import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CoverSelectedNotificationDetail from '@/views/layout/notifications/details/CoverSelectedNotificationDetail.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('CoverSelectedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('shows the selected cover and explains it now stands on the novel page', () => {
    const notification = notificationSeeder.getCoverNotification(
      NOTIFICATION_TYPES.COVER_SELECTED,
      1,
    )

    wrapper = mount(CoverSelectedNotificationDetail, { props: { notification } })

    const image = wrapper.find('.cover-selected-notification-detail__image')
    expect(image.attributes('src')).toBe(notification.cover.imageUrl)
    expect(image.attributes('alt')).toBe(
      t('cover_selected_notification_detail.image_alt', { title: notification.novel.title }),
    )
    expect(wrapper.text()).toBe(t('cover_selected_notification_detail.explanation'))
  })
})
