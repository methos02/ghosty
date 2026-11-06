const fromNotification = notification => ({
  continuation: {
    id: notification.continuation.id,
    title: notification.continuation.title,
    authorUsername: notification.continuation.author_username,
  },
  count: notification.count,
})

export const ChapterContinuedDto = {
  fromNotification,
}
