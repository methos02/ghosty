import { describe, it, expect } from 'vitest'
import { ChapterContinuedDto } from '@/apis/notifications/dtos/types/chapter-continued-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('chapter-continued-dto', () => {
  describe('fromNotification', () => {
    it('maps the latest continuation and the gathered count', () => {
      const data = notificationSeeder.getChapterContinuedApi(3)

      const notification = ChapterContinuedDto.fromNotification(data)

      expect(notification).toEqual({
        continuation: {
          id: data.data.continuation.id,
          title: data.data.continuation.title,
          authorUsername: data.data.continuation.author_username,
        },
        count: data.data.count,
      })
    })
  })
})
