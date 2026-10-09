import { describe, it, expect } from 'vitest'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-dto', () => {
  describe('fromList', () => {
    it('reads an empty inbox when the api sends no notification list', () => {
      const inbox = NotificationDto.fromList(
        notificationSeeder.getListApi({ notifications: null, unread_count: 0 }),
      )

      expect(inbox).toEqual({ notifications: [], unreadCount: 0 })
    })
  })
})
