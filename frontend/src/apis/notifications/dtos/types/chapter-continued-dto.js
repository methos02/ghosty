const fromNotification = data => ({
  continuation: {
    id: data.data.continuation.id,
    title: data.data.continuation.title,
    authorUsername: data.data.continuation.author_username,
  },
  count: data.data.count,
})

export const ChapterContinuedDto = {
  fromNotification,
}
