import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

const getChapterApi = (overrides = {}) => ({
  id: 10,
  novel_id: 1,
  parent_id: null,
  title: 'Le virage',
  summary: 'Une route de montagne, un virage manqué.',
  content: 'La voiture avait quitté la route au troisième virage...',
  depth: 0,
  has_children: false,
  children_count: 0,
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

const getCurrentBranchApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getChapterApi({
      id: index + 10,
      parent_id: index === 0 ? null : index + 9,
      title: `Chapitre ${index + 1}`,
      depth: index,
      has_children: index < count - 1,
      children_count: index < count - 1 ? 1 : 0,
      branch_like_count: 41 * (index + 1),
    }),
  )
}

const getChapter = (overrides = {}) => ({
  ...ChapterDto.fromShow(getChapterApi()),
  ...overrides,
})

const getCurrentBranch = (count = 3) => ChapterDto.fromList(getCurrentBranchApi(count))

const getReadingApi = (overrides = {}) => ({
  novel: novelSeeder.getNovelApi(),
  chapter: getChapterApi({
    id: 11,
    parent_id: 10,
    depth: 1,
    is_root: false,
  }),
  ancestors: [
    getChapterApi({
      id: 10,
      children_count: 2,
      has_children: true,
    }),
  ],
  children: [
    getChapterApi({
      id: 12,
      parent_id: 11,
      depth: 2,
      is_root: false,
      title: 'La route inverse',
    }),
    getChapterApi({
      id: 13,
      parent_id: 11,
      depth: 2,
      is_root: false,
      title: 'Le ravin',
    }),
  ],
  branch_chapter_ids: [10, 11, 12],
  is_current_branch: true,
  next_chapter_id: 12,
  ...overrides,
})

const getReading = (overrides = {}) => ({
  ...ChapterDto.fromReading(getReadingApi()),
  ...overrides,
})

const getTreeApi = (overrides = {}) => ({
  chapters: getCurrentBranchApi(3),
  current_branch_ids: [10, 11, 12],
  ...overrides,
})

const getForkedTreeApi = (overrides = {}) => ({
  chapters: [
    getChapterApi({ id: 10, children_count: 2, has_children: true, branch_like_count: 41 }),
    getChapterApi({
      id: 11,
      parent_id: 10,
      depth: 1,
      is_root: false,
      has_children: true,
      children_count: 1,
      branch_like_count: 80,
      title: 'Ce que le ravin gardait',
    }),
    getChapterApi({
      id: 12,
      parent_id: 10,
      depth: 1,
      is_root: false,
      branch_like_count: 60,
      title: 'Le passager',
    }),
    getChapterApi({
      id: 13,
      parent_id: 11,
      depth: 2,
      is_root: false,
      branch_like_count: 110,
      title: 'Le registre des disparus',
    }),
  ],
  current_branch_ids: [10, 11, 13],
  ...overrides,
})

const getForkedTree = (overrides = {}) => ({
  ...ChapterDto.fromTree(getForkedTreeApi()),
  ...overrides,
})

const getTree = (overrides = {}) => ({
  ...ChapterDto.fromTree(getTreeApi()),
  ...overrides,
})

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
  getCurrentBranchApi,
  getChapter,
  getCurrentBranch,
  getReadingApi,
  getReading,
  getTreeApi,
  getTree,
  getForkedTreeApi,
  getForkedTree,
  getWriteForm,
}
