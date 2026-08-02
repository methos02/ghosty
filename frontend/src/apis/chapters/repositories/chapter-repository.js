import { req } from '@/services/shortcuts/services-shortcut.js'

const mainContinuity = async options => {
  return await req('chapter.mainContinuity', options)
}

const getById = async options => {
  return await req('chapter.show', options)
}

const children = async options => {
  return await req('chapter.children', options)
}

export const ChapterRepository = {
  mainContinuity,
  getById,
  children,
}
