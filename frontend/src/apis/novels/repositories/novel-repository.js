import { req } from '@/services/services-helper.js'

const list = async (options) => {
  return await req('novel.list', options)
}

const getBySlug = async (options) => {
  return await req('novel.show', options)
}

export const NovelRepository = {
  list,
  getBySlug
}
