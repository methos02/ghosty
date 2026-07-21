import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'

const fromShow = (data) => ({
  id: data.id,
  slug: data.slug,
  title: data.title,
  coverUrl: data.cover_url,
  isFavorite: data.is_favorite,
  chaptersCount: data.chapters_count,
  author: AuthorDto.fromShow(data.author),
  genre: GenreDto.fromShow(data.genre),
})

const fromList = (datas = []) => {
  return datas.map(data => fromShow(data))
}

const toListParams = (page) => {
  return { page }
}

const toShowParams = (slug) => {
  return { slug }
}

export const NovelDto = {
  fromList,
  fromShow,
  toListParams,
  toShowParams,
}
