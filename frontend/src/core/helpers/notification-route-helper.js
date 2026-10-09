const chapter = (notification, chapterId) => ({
  name: 'chapter-read',
  params: {
    slug: notification.novel.slug,
    id: chapterId,
  },
})

const detail = notification => ({
  name: 'notifications',
  query: { open: notification.id },
})

const novel = notification => ({
  name: 'novel-detail',
  params: { slug: notification.novel.slug },
})

export const notificationRouteHelper = {
  chapter,
  detail,
  novel,
}
