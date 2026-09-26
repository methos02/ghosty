import { LikeDto } from '@/apis/likes/dtos/like-dto.js'

const getLikeApi = (overrides = {}) => ({
  is_liked: true,
  like_count: 42,
  ...overrides,
})

const getLike = (overrides = {}) => ({ ...LikeDto.fromLike(getLikeApi()), ...overrides })

export const likeSeeder = {
  getLikeApi,
  getLike,
}
