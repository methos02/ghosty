import { req } from '@/services/shortcuts/services-shortcut.js'
import { PROFILE_GUARD_STATUSES } from '@/constants/user-constants.js'

const listBranches = async options => {
  return await req('user.branches', options)
}

const listChapters = async options => {
  return await req('user.chapters', options)
}

const listCovers = async options => {
  return await req('user.covers', options)
}

const listNovels = async options => {
  return await req('user.novels', options)
}

const show = async options => {
  return await req('user.show', { ...options, 'no-flash': PROFILE_GUARD_STATUSES })
}

export const UserRepository = {
  listBranches,
  listChapters,
  listCovers,
  listNovels,
  show,
}
