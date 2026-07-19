import { req } from '@/services/shortcuts/services-shortcut.js'

const list = async (options) => {
  return await req('work.list', options)
}

const getById = async (options) => {
  return await req('work.show', options)
}

export const WorkRepository = {
  list,
  getById
}
