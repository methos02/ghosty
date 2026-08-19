import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'

const fromShow = data => ({
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

const toCreate = formData => ({
  novel: {
    title: formData.novel.title,
    genre_id: formData.novel.genreId,
  },
  chapter: {
    title: formData.chapter.title,
    content: formData.chapter.content,
    summary: formData.chapter.summary,
    is_draft: formData.chapter.isDraft,
  },
})

const toUpdate = formData => ({
  title: formData.title,
  genre_id: formData.genreId,
})

const toListParams = filters => {
  return {
    page: filters.page,
    search: filters.search,
    genre_id: filters.genreId,
  }
}

const toShowParams = slug => {
  return { slug }
}

export const NovelDto = {
  fromList,
  fromShow,
  toCreate,
  toUpdate,
  toListParams,
  toShowParams,
}
