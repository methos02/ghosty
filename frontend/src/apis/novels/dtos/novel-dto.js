const fromShow = (novel) => {
  return {
    id: novel.nov_id,
    title: novel.nov_title,
    coverUrl: novel.nov_cover_url,
    isFavorite: novel.nov_is_favorite,
    genre: {
      id: novel.nov_id_genre,
      label: novel.nov_genre_label
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
