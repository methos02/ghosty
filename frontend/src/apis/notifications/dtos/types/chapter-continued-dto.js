const fromNotification = notification => {
  return {
    continuation: {
      id: notification.continuation.id,
      title: notification.continuation.title,
      authorUsername: notification.continuation.author_username,
      authorProfileSlug: notification.continuation.author_profile_slug,
    },
    count: notification.count,
  }
}

export const ChapterContinuedDto = {
  fromNotification,
}
