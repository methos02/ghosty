import { req } from '@/services/services-helper.js'

const list = async (options) => {
  return await req('novel.list', options)
}

export const NovelRepository = {
  list
}
