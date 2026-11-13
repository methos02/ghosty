import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CoverSelectedNotification from '@/views/layout/notifications/CoverSelectedNotification.vue'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('CoverSelectedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('tells the illustrator their cover became the official one, leading to the covers page', () => {
    const notification = notificationSeeder.getCoverNotification(
      NOTIFICATION_TYPES.COVER_SELECTED,
      1,
    )

    wrapper = mount(CoverSelectedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('cover_selected_notification.message', { title: notification.novel.title }),
    )
    expect(message.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'novel-covers',
      params: { slug: notification.novel.slug },
    })
  })
})
