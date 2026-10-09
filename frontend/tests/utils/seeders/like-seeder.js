import { LikeDto } from '@/apis/likes/dtos/like-dto.js'

const getLikeApi = (overrides = {}) => ({
  is_liked: true,
  like_count: 42,
  ...overrides,
})

const getRefusalApi = (overrides = {}) => ({
  message: 'Votre compte est trop récent pour soutenir un chapitre',
  ...overrides,
})

const getLike = (overrides = {}) => ({ ...LikeDto.fromLike(getLikeApi()), ...overrides })

export const likeSeeder = {
  getLikeApi,
  getLike,
  getRefusalApi,
}
