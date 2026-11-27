export const novelRoutesApi = {
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
}
