import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('fromNovelList', () => {
    it('maps the novels of the profile with their pagination', () => {
      const listApi = userSeeder.getProfileNovelsApi()

      expect(UserDto.fromNovelList(listApi)).toEqual({
        novels: NovelDto.fromList(listApi.novels),
        pagination: PaginationDto.fromMeta(listApi.meta),
      })
    })
  })
})
