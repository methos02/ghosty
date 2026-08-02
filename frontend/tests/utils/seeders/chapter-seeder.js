import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'

const getChapterApi = (overrides = {}) => ({
  id: 10,
  novel_id: 1,
  parent_id: null,
  title: 'Le virage',
  summary: 'Une route de montagne, un virage manqué.',
  content: 'La voiture avait quitté la route au troisième virage...',
  depth: 0,
  is_main_child: false,
  is_branch: false,
  continuations_count: 0,
  like_count: 41,
  comment_count: 0,
  author: { id: 7, pseudo: 'GhostWriter' },
  published_at: '2026-07-31T10:00:00+00:00',
  ...overrides,
})

/**
 * Continuité principale : la racine, puis les suites mises en avant.
 */
const getMainContinuityApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getChapterApi({
      id: index + 10,
      parent_id: index === 0 ? null : index + 9,
      title: `Chapitre ${index + 1}`,
      depth: index,
      is_main_child: index > 0,
      is_branch: index < count - 1,
      continuations_count: index < count - 1 ? 1 : 0,
    }),
  )
}

const getChapter = (overrides = {}) => ({
  ...ChapterDto.fromShow(getChapterApi()),
  ...overrides,
})

const getMainContinuity = (count = 3) => ChapterDto.fromList(getMainContinuityApi(count))

export const chapterSeeder = {
  getChapterApi,
  getMainContinuityApi,
  getChapter,
  getMainContinuity,
}
