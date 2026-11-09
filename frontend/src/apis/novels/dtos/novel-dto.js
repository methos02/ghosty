import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'

const fromList = (novels = []) => {
  return novels.map(novel => NovelDto.fromShow(novel))
}

const fromShow = novel => {
  return {
    id: novel.id,
    slug: novel.slug,
    title: novel.title,
    coverUrl: novel.cover_url,
    isFavorite: novel.is_favorite,
    chaptersCount: novel.chapters_count,
    commentCount: novel.comment_count,
    author: AuthorDto.fromShow(novel.author),
    genre: GenreDto.fromShow(novel.genre),
  }
}

const fromSummary = novel => {
  return {
    id: novel?.id,
    slug: novel?.slug,
    title: novel?.title,
    genreId: novel?.genre_id,
  }
}

const toCreate = formData => {
  return {
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
  }
}

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

const toUpdate = formData => {
  return {
    title: formData.title,
    genre_id: formData.genreId,
  }
}

export const NovelDto = {
  fromList,
  fromShow,
  fromSummary,
  toCreate,
  toListParams,
  toShowParams,
  toUpdate,
}
