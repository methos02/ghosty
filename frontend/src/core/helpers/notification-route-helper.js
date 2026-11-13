const chapter = (notification, chapterId) => {
  return {
    name: 'chapter-read',
    params: {
      slug: notification.novel.slug,
      id: chapterId,
    },
  }
}

const covers = notification => {
  return {
    name: 'novel-covers',
    params: { slug: notification.novel.slug },
  }
}

const detail = notification => {
  return {
    name: 'notifications',
    query: { open: notification.id },
  }
}

const novel = notification => {
  return {
    name: 'novel-detail',
    params: { slug: notification.novel.slug },
  }
}

export const notificationRouteHelper = {
  chapter,
  covers,
  detail,
  novel,
}
