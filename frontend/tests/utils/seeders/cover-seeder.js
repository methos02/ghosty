import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'

const getCoverApi = (overrides = {}) => ({
  id: 5,
  novel_id: 1,
  image_url: 'https://example.test/storage/covers/1/brume.webp',
  like_count: 4,
  comment_count: 2,
  is_liked: false,
  is_reported: false,
  is_hidden: false,
  author: {
    id: 7,
    username: 'Illustratrice',
    slug: 'usr007',
    profile_slug: 'usr007-illustratrice',
    is_deleted: false,
  },
  created_at: '2026-11-01T10:00:00+00:00',
  updated_at: '2026-11-01T10:00:00+00:00',
  ...overrides,
})

const getCoversApi = () => [
  getCoverApi(),
  getCoverApi({
    id: 6,
    image_url: 'https://example.test/storage/covers/1/phare.webp',
    like_count: 1,
    comment_count: 0,
    author: {
      id: 8,
      username: 'Crayonneur',
      slug: 'usr008',
      profile_slug: 'usr008-crayonneur',
      is_deleted: false,
    },
  }),
]

const getListApi = (overrides = {}) => ({
  covers: getCoversApi(),
  official_cover_id: 5,
  my_cover_id: null,
  ...overrides,
})

const getLikeApi = (overrides = {}) => {
  const [official, alternative] = getCoversApi()

  return {
    cover: {
      ...alternative,
      is_liked: true,
      like_count: 2,
    },
    moved_from: {
      ...official,
      is_liked: false,
      like_count: 3,
    },
    official_cover_id: 5,
    ...overrides,
  }
}

const getUnlikeApi = (overrides = {}) => {
  return {
    cover: getCoverApi({ is_liked: false, like_count: 3 }),
    official_cover_id: 5,
    ...overrides,
  }
}

const getStoredCoverApi = (overrides = {}) => {
  return {
    cover: getCoverApi(),
    official_cover_id: 5,
    ...overrides,
  }
}

const getRefusalApi = (overrides = {}) => ({
  message: 'Vous avez déjà proposé une illustration pour ce roman',
  ...overrides,
})

const getImageFile = ({ width = 1600, height = 900 } = {}) =>
  new globalThis.File([JSON.stringify({ width, height })], 'brume.webp', { type: 'image/webp' })

const getUnreadableFile = () => new globalThis.File(['notes'], 'notes.txt', { type: 'text/plain' })

const getCreateForm = () => ({ image: getImageFile() })

const getProfileCoverApi = (overrides = {}) =>
  getCoverApi({
    is_official: true,
    novel: {
      id: 1,
      slug: 'nuit-virage',
      title: 'Nuit virage',
    },
    ...overrides,
  })

const getProfileCover = (overrides = {}) => ({
  ...CoverDto.fromProfileCover(getProfileCoverApi()),
  ...overrides,
})

const getCover = (overrides = {}) => ({ ...CoverDto.fromCover(getCoverApi()), ...overrides })

const getCovers = () => CoverDto.fromCovers(getCoversApi())

const getNovelCovers = (overrides = {}) => ({ ...CoverDto.fromList(getListApi()), ...overrides })

const getLike = (overrides = {}) => ({ ...CoverDto.fromLike(getLikeApi()), ...overrides })

export const coverSeeder = {
  getProfileCover,
  getProfileCoverApi,
  getCover,
  getCoverApi,
  getCovers,
  getCoversApi,
  getCreateForm,
  getNovelCovers,
  getListApi,
  getImageFile,
  getUnreadableFile,
  getLike,
  getLikeApi,
  getStoredCoverApi,
  getRefusalApi,
  getUnlikeApi,
}
