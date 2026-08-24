import { req } from '@/services/shortcuts/services-shortcut.js'

const children = async options => {
  return await req('chapter.children', options)
}

const create = async options => {
  return await req('chapter.create', options)
}

const currentBranch = async options => {
  return await req('chapter.currentBranch', options)
}

const destroy = async options => {
  return await req('chapter.destroy', options)
}

const drafts = async options => {
  return await req('chapter.drafts', options)
}

const getById = async options => {
  return await req('chapter.show', options)
}

const publish = async options => {
  return await req('chapter.publish', options)
}

const reading = async options => {
  return await req('chapter.reading', options)
}

const tree = async options => {
  return await req('chapter.tree', options)
}

const update = async options => {
  return await req('chapter.update', options)
}

export const ChapterRepository = {
  children,
  create,
  currentBranch,
  destroy,
  drafts,
  getById,
  publish,
  reading,
  tree,
  update,
}
