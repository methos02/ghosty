import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('fromCoverList', () => {
    it('maps the covers of the profile with their pagination', () => {
      const listApi = userSeeder.getProfileCoversApi()

      expect(UserDto.fromCoverList(listApi)).toEqual({
        covers: CoverDto.fromProfileCovers(listApi.covers),
        pagination: PaginationDto.fromMeta(listApi.meta),
      })
    })
  })
})
