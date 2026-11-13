import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { ChapterContinuedDto } from '@/apis/notifications/dtos/types/chapter-continued-dto.js'
import { ChaptersPayloadDto } from '@/apis/notifications/dtos/types/chapters-payload-dto.js'
import { CommentPayloadDto } from '@/apis/notifications/dtos/types/comment-payload-dto.js'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'
import { ModerationPayloadDto } from '@/apis/notifications/dtos/types/moderation-payload-dto.js'

const fromList = data => {
  return {
    notifications: NotificationDto.fromNotifications(data.notifications ?? []),
    unreadCount: data.unread_count,
  }
}

const fromNotification = notification => {
  return {
    id: notification.id,
    type: notification.type,
    isRead: notification.is_read,
    chapter: ChapterDto.fromSummary(notification.chapter),
    cover: CoverDto.fromSummary(notification.cover),
    novel: NovelDto.fromSummary(notification.novel),
    payload: internals.mapPayload(notification),
    updatedAtFormat: dateHelper.formatDateLocal(notification.updated_at, 'DD/MM/YYYY HH:mm'),
  }
}

const fromNotifications = notifications => {
  return notifications.map(notification => NotificationDto.fromNotification(notification))
}

const fromUnreadCount = data => {
  return data.unread_count
}

const toListParams = page => {
  return { page }
}

const toReadParams = notificationId => {
  return { notification: notificationId }
}

export const NotificationDto = {
  fromList,
  fromNotification,
  fromNotifications,
  fromUnreadCount,
  toListParams,
  toReadParams,
}

const CHAPTERS_PAYLOAD_TYPES = new Set([
  NOTIFICATION_TYPES.MAIN_BRANCH_GAINED,
  NOTIFICATION_TYPES.MAIN_BRANCH_LOST,
  NOTIFICATION_TYPES.FOLLOWED_BRANCH_EXTENDED,
])

const COMMENT_PAYLOAD_TYPES = new Set([
  NOTIFICATION_TYPES.COMMENT_RECEIVED,
  NOTIFICATION_TYPES.COMMENT_REPLIED,
])

const MODERATION_PAYLOAD_TYPES = new Set([
  NOTIFICATION_TYPES.CONTENT_MODERATED,
  NOTIFICATION_TYPES.REPORT_PROCESSED,
])

const isKnownType = notification => {
  return Object.values(NOTIFICATION_TYPES).includes(notification.type)
}

const mapPayload = notification => {
  if (!internals.isKnownType(notification)) {
    throw new Error(`[NotificationDto] Unknown notification type "${notification.type}"`)
  }

  if (notification.type === NOTIFICATION_TYPES.CHAPTER_CONTINUED) {
    return ChapterContinuedDto.fromNotification(notification)
  }

  if (notification.type === NOTIFICATION_TYPES.LIKE_RECEIVED) {
    return LikeReceivedDto.fromNotification(notification)
  }

  if (CHAPTERS_PAYLOAD_TYPES.has(notification.type)) {
    return ChaptersPayloadDto.fromNotification(notification)
  }

  if (COMMENT_PAYLOAD_TYPES.has(notification.type)) {
    return CommentPayloadDto.fromNotification(notification)
  }

  if (MODERATION_PAYLOAD_TYPES.has(notification.type)) {
    return ModerationPayloadDto.fromNotification(notification)
  }

  return {}
}

export const internals = {
  isKnownType,
  mapPayload,
}
