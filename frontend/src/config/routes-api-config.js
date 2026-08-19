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

  'chapter.currentContinuity': {
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
