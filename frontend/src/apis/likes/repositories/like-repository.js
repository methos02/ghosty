import { req } from '@/services/shortcuts/services-shortcut.js'
import { LIKE_GUARD_STATUSES } from '@/constants/like-constants.js'

const like = async options => {
  return await req('chapter.like', { ...options, 'no-flash': LIKE_GUARD_STATUSES })
}

const unlike = async options => {
  return await req('chapter.unlike', { ...options, 'no-flash': LIKE_GUARD_STATUSES })
}

export const LikeRepository = {
  like,
  unlike,
}
