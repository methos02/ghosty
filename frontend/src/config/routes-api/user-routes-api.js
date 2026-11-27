export const userRoutesApi = {
  'user.show': {
    url: 'v1/users/{slug}',
    method: 'get',
    api: 'ghosty',
  },
  'user.novels': {
    url: 'v1/users/{slug}/novels',
    method: 'get',
    api: 'ghosty',
  },
  'user.chapters': {
    url: 'v1/users/{slug}/chapters',
    method: 'get',
    api: 'ghosty',
  },
  'user.branches': {
    url: 'v1/users/{slug}/branches',
    method: 'get',
    api: 'ghosty',
  },
  'user.covers': {
    url: 'v1/users/{slug}/covers',
    method: 'get',
    api: 'ghosty',
  },
  'user.report': {
    url: 'v1/users/{slug}/report',
    method: 'post',
    api: 'ghosty',
  },
}
