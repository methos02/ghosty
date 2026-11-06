import { describe, it, expect } from 'vitest'
import { ChapterContinuedDto } from '@/apis/notifications/dtos/types/chapter-continued-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('chapter-continued-dto', () => {
  describe('fromNotification', () => {
    it('maps the latest continuation and the gathered count', () => {
      const notificationApi = notificationSeeder.getChapterContinuedApi(3)

      const notification = ChapterContinuedDto.fromNotification(notificationApi)

      expect(notification).toEqual({
        continuation: {
          id: notificationApi.continuation.id,
          title: notificationApi.continuation.title,
          authorUsername: notificationApi.continuation.author_username,
        },
        count: notificationApi.count,
      })
    })
  })
})
