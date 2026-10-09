import { inject, provide } from 'vue'

const INLINE_NOTIFICATION_DETAILS_KEY = Symbol('inline-notification-details')

export const useInlineNotificationDetails = () => provide(INLINE_NOTIFICATION_DETAILS_KEY, true)

export const useLinkedNotificationDetails = () => provide(INLINE_NOTIFICATION_DETAILS_KEY, false)

export const useHasInlineNotificationDetails = () => inject(INLINE_NOTIFICATION_DETAILS_KEY, false)
