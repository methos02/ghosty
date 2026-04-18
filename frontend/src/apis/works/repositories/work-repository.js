import { req } from '@/services/services-helper.js'

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
