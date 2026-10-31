import { req } from '@/services/shortcuts/services-shortcut.js'

const create = async options => {
  return await req('chapter.read', { ...options, flash: false })
}

const list = async options => {
  return await req('chapterRead.list', options)
}

export const ChapterReadRepository = {
  create,
  list,
}
