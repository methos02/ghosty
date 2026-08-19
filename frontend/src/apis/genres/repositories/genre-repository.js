import { req } from '@/services/shortcuts/services-shortcut.js'

const list = async () => {
  return await req('genre.list')
}

export const GenreRepository = { list }
