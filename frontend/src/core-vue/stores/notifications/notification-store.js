import { ref, readonly } from 'vue'

const defaultPagination = () => ({
  nextPage: 1,
  lastPage: 1,
})

const notifications = ref([])
const pagination = ref(defaultPagination())
const bellNotifications = ref([])
const unreadCount = ref(0)

const markReadIn = (list, notificationId) =>
  list.map(notification =>
    notification.id === notificationId ? { ...notification, isRead: true } : notification,
  )

const markAllReadIn = list => list.map(notification => ({ ...notification, isRead: true }))

const addNotifications = loaded => {
  notifications.value.push(...loaded)
}

const clear = () => {
  bellNotifications.value = []
  unreadCount.value = 0
  resetNotifications()
}

const hasMore = () => pagination.value.nextPage <= pagination.value.lastPage

const markAllAsRead = () => {
  notifications.value = markAllReadIn(notifications.value)
  bellNotifications.value = markAllReadIn(bellNotifications.value)
}

const markAsRead = notificationId => {
  notifications.value = markReadIn(notifications.value, notificationId)
  bellNotifications.value = markReadIn(bellNotifications.value, notificationId)
}

const resetNotifications = () => {
  notifications.value = []
  pagination.value = defaultPagination()
}

const setBellInbox = inbox => {
  bellNotifications.value = inbox.notifications
  unreadCount.value = inbox.unreadCount
}

const setPagination = value => {
  pagination.value = value
}

const setUnreadCount = count => {
  unreadCount.value = count
}

export const useNotificationStore = () => ({
  notifications: readonly(notifications),
  pagination: readonly(pagination),
  bellNotifications: readonly(bellNotifications),
  unreadCount: readonly(unreadCount),
  notificationStore: {
    addNotifications,
    clear,
    hasMore,
    markAllAsRead,
    markAsRead,
    resetNotifications,
    setBellInbox,
    setPagination,
    setUnreadCount,
  },
})
