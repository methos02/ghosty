import { describe, it, expect, afterEach } from 'vitest'
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-store', () => {
  describe('markAsRead', () => {
    afterEach(() => {
      useNotificationStore().notificationStore.clear()
    })

    it('marks the notification read in the bell and in the page list alike', () => {
      const { notifications, bellNotifications, notificationStore } = useNotificationStore()
      const inbox = notificationSeeder.getInbox()
      const [notification] = inbox.notifications
      notificationStore.setBellInbox(inbox)
      notificationStore.addNotifications(inbox.notifications)

      notificationStore.markAsRead(notification.id)

      expect(bellNotifications.value[0].isRead).toBe(true)
      expect(notifications.value[0].isRead).toBe(true)
    })
  })
})
