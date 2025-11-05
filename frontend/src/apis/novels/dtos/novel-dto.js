const fromShow = (novel) => {
  return {
    id: novel.id,
    title: novel.title,
    coverUrl: novel.cover_url,
    isFavorite: novel.is_favorite,
    genre: {
      id: novel.genre.id,
      label: novel.genre.name
    }
  }
}

const fromList = (novels = []) => {
  return novels.map(novel => fromShow(novel))
}

export const NovelDto = {
  fromList,
  fromShow
}
