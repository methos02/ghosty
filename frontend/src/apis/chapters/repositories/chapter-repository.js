import { req } from '@/services/shortcuts/services-shortcut.js'

const currentContinuity = async options => {
  return await req('chapter.currentContinuity', options)
}

const getById = async options => {
  return await req('chapter.show', options)
}

const children = async options => {
  return await req('chapter.children', options)
}

const create = async options => {
  return await req('chapter.create', options)
}

const update = async options => {
  return await req('chapter.update', options)
}

const publish = async options => {
  return await req('chapter.publish', options)
}

const destroy = async options => {
  return await req('chapter.destroy', options)
}

const drafts = async options => {
  return await req('chapter.drafts', options)
}

export const ChapterRepository = {
  currentContinuity,
  getById,
  children,
  create,
  update,
  publish,
  destroy,
  drafts,
}
