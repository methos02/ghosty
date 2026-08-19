import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'

const getChapterApi = (overrides = {}) => ({
  id: 10,
  novel_id: 1,
  parent_id: null,
  title: 'Le virage',
  summary: 'Une route de montagne, un virage manqué.',
  content: 'La voiture avait quitté la route au troisième virage...',
  depth: 0,
  is_continued: false,
  continuations_count: 0,
  like_count: 41,
  branch_like_count: 41,
  comment_count: 0,
  author: { id: 7, username: 'GhostWriter' },
  novel: {
    id: 1,
    slug: 'nuit-virage',
    title: 'Nuit virage',
    genre_id: 3,
  },
  is_draft: false,
  is_correctable: true,
  is_root: true,
  published_at: '2026-07-31T10:00:00+00:00',
  ...overrides,
})

const getCurrentContinuityApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getChapterApi({
      id: index + 10,
      parent_id: index === 0 ? null : index + 9,
      title: `Chapitre ${index + 1}`,
      depth: index,
      is_continued: index < count - 1,
      continuations_count: index < count - 1 ? 1 : 0,
      branch_like_count: 41 * (index + 1),
    }),
  )
}

const getChapter = (overrides = {}) => ({
  ...ChapterDto.fromShow(getChapterApi()),
  ...overrides,
})

const getCurrentContinuity = (count = 3) => ChapterDto.fromList(getCurrentContinuityApi(count))

const getWriteForm = (overrides = {}) => ({
  parentId: 10,
  title: 'La route inverse',
  content: 'La voiture repartit en sens inverse, phares éteints...',
  summary: 'La voiture repart en sens inverse.',
  isDraft: false,
  ...overrides,
})

export const chapterSeeder = {
  getChapterApi,
  getCurrentContinuityApi,
  getChapter,
  getCurrentContinuity,
  getWriteForm,
}
