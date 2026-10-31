import { req } from '@/services/shortcuts/services-shortcut.js'

const follow = async options => {
  return await req('chapter.follow', options)
}

const list = async options => {
  return await req('follow.list', options)
}

const unfollow = async options => {
  return await req('chapter.unfollow', options)
}

export const FollowRepository = {
  follow,
  list,
  unfollow,
}
