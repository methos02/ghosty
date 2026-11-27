export const chapterRoutesApi = {
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
}
