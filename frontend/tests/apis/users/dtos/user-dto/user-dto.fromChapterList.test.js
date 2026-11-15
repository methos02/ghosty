import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('fromChapterList', () => {
    it('maps the chapters of the profile with their pagination', () => {
      const listApi = userSeeder.getProfileChaptersApi()

      expect(UserDto.fromChapterList(listApi)).toEqual({
        chapters: ChapterDto.fromProfileChapters(listApi.chapters),
        pagination: PaginationDto.fromMeta(listApi.meta),
      })
    })
  })
})
