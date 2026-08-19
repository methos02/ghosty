import { req } from '@/services/shortcuts/services-shortcut.js'

const list = async options => {
  return await req('novel.list', options)
}

const getBySlug = async options => {
  return await req('novel.show', options)
}

const create = async options => {
  return await req('novel.create', options)
}

const update = async options => {
  return await req('novel.update', options)
}

export const NovelRepository = {
  list,
  getBySlug,
  create,
  update,
}
