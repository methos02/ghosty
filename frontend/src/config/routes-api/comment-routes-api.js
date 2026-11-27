export const commentRoutesApi = {
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
  'comment.report': {
    url: 'v1/comments/{comment}/report',
    method: 'post',
    api: 'ghosty',
  },
  'comment.coverThread': {
    url: 'v1/covers/{cover}/comments',
    method: 'get',
    api: 'ghosty',
  },
  'comment.createOnCover': {
    url: 'v1/covers/{cover}/comments',
    method: 'post',
    api: 'ghosty',
  },
}
