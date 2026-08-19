import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'

const getNovelApi = (overrides = {}) => ({
  id: 1,
  slug: 'le-roman-fantome',
  title: 'Le Roman Fantôme',
  cover_url: 'https://example.test/covers/1.jpg',
  is_favorite: false,
  chapters_count: 12,
  author: { id: 7, username: 'GhostWriter' },
  genre: { id: 3, name: 'Fantastique' },
  ...overrides,
})

const getNovelsApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getNovelApi({
      id: index + 1,
      slug: `roman-${index + 1}`,
      title: `Roman ${index + 1}`,
    }),
  )
}

const getNovel = (overrides = {}) => ({
  ...NovelDto.fromShow(getNovelApi()),
  ...overrides,
})

const getNovels = (count = 3) => NovelDto.fromList(getNovelsApi(count))

const getCreateForm = (overrides = {}) => ({
  novel: {
    title: 'Le Roman Fantôme',
    genreId: 3,
    ...overrides.novel,
  },
  chapter: {
    title: 'Le virage',
    content: 'La voiture avait quitté la route au troisième virage...',
    summary: 'Une route de montagne, un virage manqué.',
    ...overrides.chapter,
  },
})

export const novelSeeder = {
  getNovelApi,
  getNovelsApi,
  getNovel,
  getNovels,
  getCreateForm,
}
