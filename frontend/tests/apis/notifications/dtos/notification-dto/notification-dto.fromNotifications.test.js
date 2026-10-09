import { describe, it, expect } from 'vitest'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-dto', () => {
  describe('fromNotifications', () => {
    it('fails loudly on a notification type the front does not know', () => {
      const datas = [
        notificationSeeder.getLikeReceivedApi(1),
        notificationSeeder.getNotificationApi({ type: 'unknown_type' }),
      ]

      expect(() => NotificationDto.fromNotifications(datas)).toThrow(
        '[NotificationDto] Unknown notification type "unknown_type"',
      )
    })
  })
})
