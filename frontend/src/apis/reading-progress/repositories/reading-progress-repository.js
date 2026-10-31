import { req } from '@/services/shortcuts/services-shortcut.js'

const list = async options => {
  return await req('readingProgress.list', options)
}

export const ReadingProgressRepository = {
  list,
}
