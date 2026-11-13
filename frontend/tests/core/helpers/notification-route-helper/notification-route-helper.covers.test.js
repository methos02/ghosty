import { describe, it, expect } from 'vitest'
import { notificationRouteHelper } from '@/core/helpers/notification-route-helper.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-route-helper', () => {
  describe('covers', () => {
    it('leads to the covers page of the novel the notification is about', () => {
      const notification = notificationSeeder.getNotification()

      expect(notificationRouteHelper.covers(notification)).toEqual({
        name: 'novel-covers',
        params: { slug: notification.novel.slug },
      })
    })
  })
})
