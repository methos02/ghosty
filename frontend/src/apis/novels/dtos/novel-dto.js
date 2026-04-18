const generateSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const fromShow = (novel) => {
  const title = novel.title || novel.nov_title
  const slug = novel.slug || novel.nov_slug || generateSlug(title)

  return {
    id: novel.id || novel.nov_id,
    slug,
    title,
    coverUrl: novel.cover_url || novel.nov_cover_url,
    isFavorite: novel.is_favorite || novel.nov_is_favorite,
    chaptersCount: novel.chapters_count || novel.nov_chapters_count || 0,
    author: {
      id: novel.author?.id || novel.nov_id_author,
      pseudo: novel.author?.pseudo || novel.author_pseudo
    },
    genre: {
      id: novel.genre?.id || novel.nov_id_genre,
      label: novel.genre?.name || novel.genre_name || novel.nov_genre_label
    }
  }
}

const fromList = (novels = []) => {
  return novels.map(novel => fromShow(novel))
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
  toShowParams
}
