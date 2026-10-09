import { describe, it, expect } from 'vitest'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('like-received-dto', () => {
  describe('fromNotification', () => {
    it('maps the last reader and the gathered supports', () => {
      const data = notificationSeeder.getLikeReceivedApi(12)

      const notification = LikeReceivedDto.fromNotification(data)

      expect(notification).toEqual({
        lastActorUsername: data.data.last_actor_username,
        count: data.data.count,
      })
    })
  })
})
