export const routesApi = {
  'novel.list': {
    url: 'v1/novels',
    method: 'get',
    api: 'ghosty',
  },
  'novel.show': {
    url: 'v1/novels/{slug}',
    method: 'get',
    api: 'ghosty',
  },
  'novel.create': {
    url: 'v1/novels',
    method: 'post',
    api: 'ghosty',
  },
  'novel.update': {
    url: 'v1/novels/{slug}',
    method: 'put',
    api: 'ghosty',
  },

  'genre.list': {
    url: 'v1/genres',
    method: 'get',
    api: 'ghosty',
  },

  'chapter.mainBranch': {
    url: 'v1/novels/{slug}/chapters',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.show': {
    url: 'v1/chapters/{chapter}',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.children': {
    url: 'v1/chapters/{chapter}/children',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.reading': {
    url: 'v1/novels/{slug}/chapters/{chapter}',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.tree': {
    url: 'v1/novels/{slug}/tree',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.create': {
    url: 'v1/novels/{slug}/chapters',
    method: 'post',
    api: 'ghosty',
  },
  'chapter.update': {
    url: 'v1/chapters/{chapter}',
    method: 'put',
    api: 'ghosty',
  },
  'chapter.publish': {
    url: 'v1/chapters/{chapter}/publish',
    method: 'post',
    api: 'ghosty',
  },
  'chapter.destroy': {
    url: 'v1/chapters/{chapter}',
    method: 'delete',
    api: 'ghosty',
  },
  'chapter.drafts': {
    url: 'v1/me/drafts',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.published': {
    url: 'v1/me/chapters',
    method: 'get',
    api: 'ghosty',
  },
  'chapter.like': {
    url: 'v1/chapters/{chapter}/like',
    method: 'post',
    api: 'ghosty',
  },
  'chapter.unlike': {
    url: 'v1/chapters/{chapter}/like',
    method: 'delete',
    api: 'ghosty',
  },
  'chapter.report': {
    url: 'v1/chapters/{chapter}/report',
    method: 'post',
    api: 'ghosty',
  },
  'chapter.follow': {
    url: 'v1/chapters/{chapter}/follow',
    method: 'post',
    api: 'ghosty',
  },
  'chapter.unfollow': {
    url: 'v1/chapters/{chapter}/follow',
    method: 'delete',
    api: 'ghosty',
  },
  'chapter.read': {
    url: 'v1/chapters/{chapter}/read',
    method: 'post',
    api: 'ghosty',
  },

  'follow.list': {
    url: 'v1/me/follows',
    method: 'get',
    api: 'ghosty',
  },

  'readingProgress.list': {
    url: 'v1/me/reading-progress',
    method: 'get',
    api: 'ghosty',
  },

  'chapterRead.list': {
    url: 'v1/me/reading-history',
    method: 'get',
    api: 'ghosty',
  },

  'comment.chapterThread': {
    url: 'v1/chapters/{chapter}/comments',
    method: 'get',
    api: 'ghosty',
  },
  'comment.novelThread': {
    url: 'v1/novels/{slug}/comments',
    method: 'get',
    api: 'ghosty',
  },
  'comment.createOnChapter': {
    url: 'v1/chapters/{chapter}/comments',
    method: 'post',
    api: 'ghosty',
  },
  'comment.createOnNovel': {
    url: 'v1/novels/{slug}/comments',
    method: 'post',
    api: 'ghosty',
  },
  'comment.reply': {
    url: 'v1/comments/{comment}/replies',
    method: 'post',
    api: 'ghosty',
  },
  'comment.destroy': {
    url: 'v1/comments/{comment}',
    method: 'delete',
    api: 'ghosty',
  },

  'notification.list': {
    url: 'v1/me/notifications',
    method: 'get',
    api: 'ghosty',
  },
  'notification.read': {
    url: 'v1/me/notifications/{notification}/read',
    method: 'post',
    api: 'ghosty',
  },
  'notification.readAll': {
    url: 'v1/me/notifications/read-all',
    method: 'patch',
    api: 'ghosty',
  },

  'auth.login': {
    url: 'v1/auth/login',
    method: 'post',
    api: 'ghosty',
  },
  'auth.register': {
    url: 'v1/auth/register',
    method: 'post',
    api: 'ghosty',
  },
  'auth.logout': {
    url: 'v1/auth/logout',
    method: 'post',
    api: 'ghosty',
  },
  'auth.me': {
    url: 'v1/auth/me',
    method: 'get',
    api: 'ghosty',
  },
}
