import { ReadingProgressDto } from '@/apis/reading-progress/dtos/reading-progress-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

const getReadingProgressApi = (overrides = {}) => ({
  chapter: chapterSeeder.getChapterApi({ id: 41, title: 'Le pont de la Sablière' }),
  read_at: '2026-10-03T08:05:00+00:00',
  ...overrides,
})

const getReadingProgressesApi = (count = 2) =>
  Array.from({ length: count }, (_, index) =>
    getReadingProgressApi({
      chapter: chapterSeeder.getChapterApi({
        id: 41 + index,
        title: `Arrêt ${index + 1}`,
        novel: {
          id: index + 1,
          slug: `roman-${index + 1}`,
          title: `Roman ${index + 1}`,
          genre_id: 3,
        },
      }),
    }),
  )

const getListApi = (overrides = {}) => ({
  progresses: getReadingProgressesApi(2),
  ...overrides,
})

const getReadingProgresses = (count = 2) =>
  ReadingProgressDto.fromList(getReadingProgressesApi(count))

export const readingProgressSeeder = {
  getListApi,
  getReadingProgressApi,
  getReadingProgresses,
  getReadingProgressesApi,
}
