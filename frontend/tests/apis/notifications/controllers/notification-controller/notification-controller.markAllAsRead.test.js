import { describe, it, expect, vi, afterEach } from 'vitest'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('notification-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('markAllAsRead', () => {
    it('returns the unread count the api left', async () => {
      vi.spyOn(NotificationRepository, 'markAllAsRead').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { unread_count: 0 },
      })

      expect(await NotificationController.markAllAsRead()).toEqual({
        status: STATUS.SUCCESS,
        unreadCount: 0,
      })
    })
  })
})
