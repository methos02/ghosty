import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const SESSION_KEY = '2b1f0c8e-5d3a-4f6b-9a7c-1e2d3c4b5a69'

const getSessionKey = () => SESSION_KEY

const getChapterReadApi = (overrides = {}) => ({
  chapter: chapterSeeder.getChapterApi({ id: 31, title: 'Ce que le ravin gardait' }),
  read_at: '2026-10-02T21:40:00+00:00',
  ...overrides,
})

const getChapterReadsApi = (count = 2) =>
  Array.from({ length: count }, (_, index) =>
    getChapterReadApi({
      chapter: chapterSeeder.getChapterApi({ id: 31 + index, title: `Chapitre lu ${index + 1}` }),
    }),
  )

const getListApi = (overrides = {}) => ({
  reads: getChapterReadsApi(2),
  meta: paginationSeeder.getMetaApi({ total: 2, last_page: 1 }),
  ...overrides,
})

const getChapterRead = (overrides = {}) => ({
  ...ChapterReadDto.fromShow(getChapterReadApi()),
  ...overrides,
})

const getChapterReads = (count = 2) => ChapterReadDto.fromList(getChapterReadsApi(count))

export const chapterReadSeeder = {
  getChapterRead,
  getChapterReadApi,
  getChapterReads,
  getChapterReadsApi,
  getListApi,
  getSessionKey,
}
