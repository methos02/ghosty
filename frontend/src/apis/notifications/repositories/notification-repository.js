import { req } from '@/services/shortcuts/services-shortcut.js'

const list = async options => {
  return await req('notification.list', { ...options, flash: false })
}

const markAllAsRead = async options => {
  return await req('notification.readAll', options)
}

const markAsRead = async options => {
  return await req('notification.read', options)
}

export const NotificationRepository = {
  list,
  markAllAsRead,
  markAsRead,
}
