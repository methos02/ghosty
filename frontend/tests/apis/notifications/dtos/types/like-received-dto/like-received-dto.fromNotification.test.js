import { describe, it, expect } from 'vitest'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('like-received-dto', () => {
  describe('fromNotification', () => {
    it('maps the last reader and the gathered supports', () => {
      const notificationApi = notificationSeeder.getLikeReceivedApi(12)

      const notification = LikeReceivedDto.fromNotification(notificationApi)

      expect(notification).toEqual({
        lastActorUsername: notificationApi.last_actor_username,
        count: notificationApi.count,
      })
    })
  })
})
