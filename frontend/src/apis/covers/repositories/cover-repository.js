import { req } from '@/services/shortcuts/services-shortcut.js'
import { COVER_GUARD_STATUSES, COVER_LIKE_GUARD_STATUSES } from '@/constants/cover-constants.js'

const create = async options => {
  return await req('cover.create', { ...options, 'no-flash': COVER_GUARD_STATUSES })
}

const like = async options => {
  return await req('cover.like', { ...options, 'no-flash': COVER_LIKE_GUARD_STATUSES })
}

const list = async options => {
  return await req('cover.list', options)
}

const replaceImage = async options => {
  return await req('cover.replaceImage', { ...options, 'no-flash': COVER_GUARD_STATUSES })
}

const unlike = async options => {
  return await req('cover.unlike', { ...options, 'no-flash': COVER_LIKE_GUARD_STATUSES })
}

export const CoverRepository = {
  create,
  like,
  list,
  replaceImage,
  unlike,
}
