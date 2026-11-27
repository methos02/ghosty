export const moderationRoutesApi = {
  'moderation.reportedContents': {
    url: 'v1/moderation/reports',
    method: 'get',
    api: 'ghosty',
  },
  'moderation.showChapter': {
    url: 'v1/moderation/chapters/{chapter}',
    method: 'get',
    api: 'ghosty',
  },
  'moderation.moderateChapter': {
    url: 'v1/moderation/chapters/{chapter}/decision',
    method: 'post',
    api: 'ghosty',
  },
  'moderation.restoreChapter': {
    url: 'v1/moderation/chapters/{chapter}/restore',
    method: 'post',
    api: 'ghosty',
  },
  'moderation.showComment': {
    url: 'v1/moderation/comments/{comment}',
    method: 'get',
    api: 'ghosty',
  },
  'moderation.moderateComment': {
    url: 'v1/moderation/comments/{comment}/decision',
    method: 'post',
    api: 'ghosty',
  },
  'moderation.restoreComment': {
    url: 'v1/moderation/comments/{comment}/restore',
    method: 'post',
    api: 'ghosty',
  },
  'moderation.showCover': {
    url: 'v1/moderation/covers/{cover}',
    method: 'get',
    api: 'ghosty',
  },
  'moderation.moderateCover': {
    url: 'v1/moderation/covers/{cover}/decision',
    method: 'post',
    api: 'ghosty',
  },
  'moderation.restoreCover': {
    url: 'v1/moderation/covers/{cover}/restore',
    method: 'post',
    api: 'ghosty',
  },
  'moderation.showUser': {
    url: 'v1/moderation/users/{user}',
    method: 'get',
    api: 'ghosty',
  },
  'moderation.moderateUser': {
    url: 'v1/moderation/users/{user}/decision',
    method: 'post',
    api: 'ghosty',
  },
}
