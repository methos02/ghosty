import { req } from '@/services/shortcuts/services-shortcut.js'

const list = async (options) => {
  return await req('work.list', options)
}

const getById = async (options) => {
  return await req('work.show', options)
}

const create = async (options) => {
  return await req('work.create', options)
}

const update = async (options) => {
  return await req('work.update', options)
}

const vote = async (options) => {
  return await req('work.vote', options)
}

export const WorkRepository = {
  list,
  getById,
  create,
  update,
  vote,
}
