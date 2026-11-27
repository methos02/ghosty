export const coverRoutesApi = {
  'cover.list': {
    url: 'v1/novels/{slug}/covers',
    method: 'get',
    api: 'ghosty',
  },
  'cover.create': {
    url: 'v1/novels/{slug}/covers',
    method: 'post',
    api: 'ghosty',
  },
  'cover.replaceImage': {
    url: 'v1/covers/{cover}/image',
    method: 'post',
    api: 'ghosty',
  },
  'cover.like': {
    url: 'v1/covers/{cover}/like',
    method: 'post',
    api: 'ghosty',
  },
  'cover.unlike': {
    url: 'v1/covers/{cover}/like',
    method: 'delete',
    api: 'ghosty',
  },
  'cover.report': {
    url: 'v1/covers/{cover}/report',
    method: 'post',
    api: 'ghosty',
  },
}
