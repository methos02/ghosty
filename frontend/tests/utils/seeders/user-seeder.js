import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { USER_ROLES } from '@/constants/user-constants.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const getUserApi = (overrides = {}) => ({
  id: 42,
  username: 'GhostWriter',
  email: 'ghost@ghosty.test',
  roles: ['user'],
  avatar: null,
  firstname: 'Jean',
  lastname: 'Dupont',
  birth_date: '1990-01-01',
  notifications_enabled: true,
  new_messages_count: 2,
  email_verified_at: '2025-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

const getUserWithAvatarApi = (overrides = {}) =>
  getUserApi({ avatar: 'https://example.test/avatars/42.png', ...overrides })

const getUser = (overrides = {}) => ({ ...AuthDto.fromUser(getUserApi()), ...overrides })

const getUserWithAvatar = () => AuthDto.fromUser(getUserWithAvatarApi())

const getRegisterForm = (overrides = {}) => ({
  username: 'GhostWriter',
  email: 'ghost@ghosty.test',
  password: 'Secret123!',
  passwordConfirmation: 'Secret123!',
  ...overrides,
})

const getLoginForm = (overrides = {}) => ({
  identifier: 'ghost@ghosty.test',
  password: 'Secret123!',
  ...overrides,
})

const getStatisticsApi = (overrides = {}) => ({
  read_count: 128,
  like_count: 37,
  received_continuation_count: 5,
  novel_count: 2,
  chapter_count: 9,
  cover_count: 3,
  official_cover_count: 1,
  ...overrides,
})

const getProfileApi = (overrides = {}) => ({
  id: 42,
  username: 'GhostWriter',
  avatar: null,
  roles: [USER_ROLES.READER, USER_ROLES.AUTHOR, USER_ROLES.ILLUSTRATOR],
  created_at: '2024-01-01T00:00:00+00:00',
  is_reported: false,
  statistics: getStatisticsApi(),
  ...overrides,
})

const getProfile = (overrides = {}) => ({ ...UserDto.fromProfile(getProfileApi()), ...overrides })

const getProfileNovelsApi = (overrides = {}) => ({
  novels: novelSeeder.getNovelsApi(2),
  meta: paginationSeeder.getMetaApi(),
  ...overrides,
})

const getProfileChaptersApi = (overrides = {}) => ({
  chapters: [
    chapterSeeder.getProfileChapterApi(),
    chapterSeeder.getProfileChapterApi({
      id: 11,
      title: 'La brume',
      is_in_main_branch: false,
    }),
  ],
  meta: paginationSeeder.getMetaApi(),
  ...overrides,
})

const getProfileCoversApi = (overrides = {}) => ({
  covers: [coverSeeder.getProfileCoverApi()],
  meta: paginationSeeder.getMetaApi(),
  ...overrides,
})

export const userSeeder = {
  getProfile,
  getProfileApi,
  getProfileChaptersApi,
  getProfileCoversApi,
  getProfileNovelsApi,
  getStatisticsApi,
  getUserApi,
  getUser,
  getUserWithAvatarApi,
  getUserWithAvatar,
  getRegisterForm,
  getLoginForm,
}
