import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('chapter-dto', () => {
  describe('fromProfileChapters', () => {
    it('maps every chapter of the profile list', () => {
      const chaptersApi = userSeeder.getProfileChaptersApi().chapters

      expect(ChapterDto.fromProfileChapters(chaptersApi)).toEqual(
        chaptersApi.map(chapterApi => ChapterDto.fromProfileChapter(chapterApi)),
      )
    })
  })
})
