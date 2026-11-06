const fromNotification = notification => ({
  chapters: notification.chapters.map(chapter => ({
    id: chapter.id,
    title: chapter.title,
  })),
  count: notification.count,
})

export const ChaptersPayloadDto = {
  fromNotification,
}
