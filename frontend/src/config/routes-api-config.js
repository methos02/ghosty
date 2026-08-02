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

  'chapter.mainContinuity': {
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
