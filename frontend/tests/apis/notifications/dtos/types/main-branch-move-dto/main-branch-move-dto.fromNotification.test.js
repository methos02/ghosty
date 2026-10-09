import { describe, it, expect } from 'vitest'
import { MainBranchMoveDto } from '@/apis/notifications/dtos/types/main-branch-move-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('main-branch-move-dto', () => {
  describe('fromNotification', () => {
    it('maps every chapter of the author that moved and their count', () => {
      const data = notificationSeeder.getMainBranchMoveApi('main_branch_lost', 2)

      const notification = MainBranchMoveDto.fromNotification(data)

      expect(notification).toEqual({
        chapters: data.data.chapters,
        count: data.data.count,
      })
    })
  })
})
