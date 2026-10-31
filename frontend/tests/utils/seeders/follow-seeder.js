import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const getFollowStateApi = (overrides = {}) => ({
  is_followed: true,
  ...overrides,
})

const getFollowApi = (overrides = {}) => ({
  chapter: chapterSeeder.getChapterApi({ id: 21, title: 'Le passager' }),
  followed_at: '2026-10-01T20:15:00+00:00',
  ...overrides,
})

const getFollowsApi = (count = 2) =>
  Array.from({ length: count }, (_, index) =>
    getFollowApi({
      chapter: chapterSeeder.getChapterApi({ id: 21 + index, title: `Branche ${index + 1}` }),
    }),
  )

const getListApi = (overrides = {}) => ({
  follows: getFollowsApi(2),
  meta: paginationSeeder.getMetaApi({ total: 2, last_page: 1 }),
  ...overrides,
})

const getFollow = (overrides = {}) => ({ ...FollowDto.fromShow(getFollowApi()), ...overrides })

const getFollows = (count = 2) => FollowDto.fromList(getFollowsApi(count))

export const followSeeder = {
  getFollow,
  getFollowApi,
  getFollows,
  getFollowsApi,
  getFollowStateApi,
  getListApi,
}
