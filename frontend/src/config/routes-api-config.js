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

  'work.list': {
    url: 'v1/works',
    method: 'get',
    api: 'ghosty',
  },
  'work.show': {
    url: 'v1/works/{slug}',
    method: 'get',
    api: 'ghosty',
  },
  'work.create': {
    url: 'v1/works',
    method: 'post',
    api: 'ghosty',
  },
  'work.update': {
    url: 'v1/works/{id}',
    method: 'put',
    api: 'ghosty',
  },
  'work.vote': {
    url: 'v1/works/{id}/vote',
    method: 'post',
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
  'auth.user': {
    url: 'v1/auth/user',
    method: 'get',
    api: 'ghosty',
  },
}
