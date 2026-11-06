import { describe, it, expect } from 'vitest'
import { ChaptersPayloadDto } from '@/apis/notifications/dtos/types/chapters-payload-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('chapters-payload-dto', () => {
  describe('fromNotification', () => {
    it('maps every chapter of the author that moved and their count', () => {
      const notificationApi = notificationSeeder.getChaptersPayloadApi('main_branch_lost', 2)

      const notification = ChaptersPayloadDto.fromNotification(notificationApi)

      expect(notification).toEqual({
        chapters: notificationApi.chapters,
        count: notificationApi.count,
      })
    })
  })
})
