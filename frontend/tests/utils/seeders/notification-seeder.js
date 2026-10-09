import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'

const getNotificationApi = (overrides = {}) => ({
  id: '9b2f6a1e-3c4d-4e5f-8a9b-0c1d2e3f4a5b',
  type: 'like_received',
  data: {
    chapter: {
      id: 12,
      title: 'Le phare',
    },
    novel: {
      slug: 'la-maree-noire',
      title: 'La marée noire',
    },
    last_actor_username: 'Lectrice',
    count: 1,
  },
  is_read: false,
  created_at: '2026-09-20T08:00:00+00:00',
  updated_at: '2026-09-20T08:00:00+00:00',
  ...overrides,
})

const getLikeReceivedApi = (count, overrides = {}) =>
  getNotificationApi({
    type: 'like_received',
    data: {
      chapter: {
        id: 12,
        title: 'Le phare',
      },
      novel: {
        slug: 'la-maree-noire',
        title: 'La marée noire',
      },
      last_actor_username: 'Lectrice',
      count,
    },
    ...overrides,
  })

const getChapterContinuedApi = (count, overrides = {}) =>
  getNotificationApi({
    type: 'chapter_continued',
    data: {
      chapter: {
        id: 12,
        title: 'Le phare',
      },
      novel: {
        slug: 'la-maree-noire',
        title: 'La marée noire',
      },
      continuation: {
        id: 31,
        title: 'La lanterne',
        author_username: 'Plume',
      },
      count,
    },
    ...overrides,
  })

const getMainBranchMoveApi = (type, count, overrides = {}) =>
  getNotificationApi({
    type,
    data: {
      chapter: {
        id: 12,
        title: 'Le phare',
      },
      novel: {
        slug: 'la-maree-noire',
        title: 'La marée noire',
      },
      chapters: Array.from({ length: count }, (_, index) => ({
        id: 12 + index,
        title: index === 0 ? 'Le phare' : `La lanterne ${index}`,
      })),
      count,
    },
    ...overrides,
  })

const getNotification = (overrides = {}) => ({
  ...NotificationDto.fromNotification(getNotificationApi()),
  ...overrides,
})

const getLikeReceived = count => NotificationDto.fromNotification(getLikeReceivedApi(count))

const getChapterContinued = count => NotificationDto.fromNotification(getChapterContinuedApi(count))

const getMainBranchMove = (type, count) =>
  NotificationDto.fromNotification(getMainBranchMoveApi(type, count))

const getListApi = (overrides = {}) => ({
  notifications: [getNotificationApi()],
  unread_count: 1,
  meta: {
    current_page: 1,
    per_page: 20,
    total: 1,
    last_page: 1,
  },
  ...overrides,
})

const getInbox = (overrides = {}) => ({ ...NotificationDto.fromList(getListApi()), ...overrides })

export const notificationSeeder = {
  getChapterContinued,
  getChapterContinuedApi,
  getMainBranchMove,
  getMainBranchMoveApi,
  getInbox,
  getLikeReceived,
  getLikeReceivedApi,
  getListApi,
  getNotification,
  getNotificationApi,
}
